import { Auth, DataStore, Predicates, SortDirection, Storage, API } from 'aws-amplify'
import { v4 as uuid } from 'uuid'

import { Post as PostModel, Media as MediaModel, Profile } from '../models'
import {
  APILoginParam,
  User,
  APISignUpParam,
  APICreatePostParam,
  PostToMediaMap,
  APIGetPostsParam,
  Post,
} from '../types'
import { getErrorMessage, createMedia, updateLikesMap } from './helpers'

//==============================================================================
// User
//==============================================================================

export const searchUser = async (username: string) => {
  try {
    const apiName = 'AdminQueries'
    const path = '/listUsers'
    const session: { [anyProps: string]: any } = await Auth.currentSession()

    const token = session.getAccessToken().getJwtToken()

    const myInit = {
      queryStringParameters: {
        groupname: 'Users',
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }
    let result: { Users: { [anyProps: string]: any }[] } = await API.get(apiName, path, myInit)

    result.Users = result.Users.filter((u) =>
      u.Username.toLowerCase().includes(username.toLowerCase())
    )

    return result.Users.length === 0
      ? null
      : result.Users.map((u) => ({
          username: u.Username,
          fullName: u.Attributes[2].Value,
          email: u.Attributes[3].Value,
        }))
  } catch (error) {
    console.error({ clientSearchUserError: error })
    throw new Error(getErrorMessage(error))
  }
}

export const getUserDetail = async (username: string): Promise<Profile> => {
  try {
    const profile = await DataStore.query(Profile, (p) => p.username('eq', username))
    return profile[0]
  } catch (error: any) {
    console.error({ clientGetUserDetailError: error })

    if (error.isAxiosError && error.response.data.message.includes('User does not exist')) {
      error.code = 'UserNotFoundException'
      error.message = 'User not found.'
    }

    throw new Error(getErrorMessage(error))
  }
}

//==============================================================================
// Post
//==============================================================================

export const toggleLike = async (postID: string, username: string) => {
  try {
    const post: PostModel | undefined = await DataStore.query(PostModel, postID)

    if (!post) throw new Error('Post not found')

    const updates = updateLikesMap(post.likesMap, post.likeCount, username)

    await DataStore.save(
      PostModel.copyOf(post, (updated) => {
        updated.likeCount = updates.likeCount
        updated.likesMap = updates.likesMap
      })
    )
  } catch (error) {
    console.error({ clientToggleLikeError: error })
  }
}

export const getUserPosts = async (username: string) => {
  try {
    let posts: Post[] = await DataStore.query(PostModel)
    posts = posts.filter((p) => p.owner === username)
    let postToMediaMap: PostToMediaMap = await mapPostsToMedias(posts)
    return { username: username, posts: posts, postToMediaMap }
  } catch (error) {
    console.error({ clientGetUserPostsError: error })
    throw new Error(getErrorMessage(error))
  }
}

export const deletePost = async (postID: string) => {
  try {
    const postMedias: MediaModel[] = await DataStore.query(MediaModel, (m) =>
      m.postID('eq', postID)
    )
    await DataStore.delete(PostModel, (p) => p.id('eq', postID))
    await Promise.all(postMedias.map(async (m) => await Storage.remove(m.mediaKey)))
  } catch (error) {
    console.error({ clientDeletePostErrro: error })
    throw error
  }
}

export const getPosts = async ({ page = 0 }: APIGetPostsParam) => {
  try {
    const posts: PostModel[] = await DataStore.query(PostModel, Predicates.ALL, {
      page,
      limit: 6,
      sort: (s) => s.createdAt(SortDirection.DESCENDING),
    })

    if (posts) {
      let postToMediaMap: PostToMediaMap = await mapPostsToMedias(posts)
      return { posts: posts, postToMediaMap }
    }

    return { posts: [], postToMediaMap: {} }
  } catch (error) {
    console.error({ clientGetPostsError: error })
    throw new Error(getErrorMessage(error))
  }
}

export const createPost = async ({ postInput, medias, owner }: APICreatePostParam) => {
  try {
    const post: PostModel = await DataStore.save(new PostModel({ caption: postInput.caption }))

    let postToMediaMap: PostToMediaMap = {}

    const result: MediaModel[] = await Promise.all(
      medias.map(async (file) => {
        const key = await uploadMedia(file)
        const url = await getSignedMediaUrl(key)
        postToMediaMap[post.id] = url || ''
        return await createMedia({ postID: post.id, mediaKey: key })
      })
    )

    result.forEach((m) => {
      if (!m) {
        return
      }
      post.Media?.push(m)
    })

    return { username: owner, post: { ...post, owner }, postToMediaMap }
  } catch (error: any) {
    console.error({ clientCreateNewPostError: error })
    throw new Error(getErrorMessage(error))
  }
}

//==============================================================================
// Storage
//==============================================================================

export const getSignedMediaUrl = async (key: string | undefined) => {
  if (!key) {
    return
  }
  return await Storage.get(key)
}

export const mapPostsToMedias = async (posts: Post[]): Promise<PostToMediaMap> => {
  const postToMediaMap: PostToMediaMap = {}

  await Promise.all(
    posts.map(async (p) => {
      const medias: MediaModel[] = (await DataStore.query(MediaModel)).filter(
        (m) => m.postID === p.id
      )

      if (medias[0]) {
        const url = await getSignedMediaUrl(medias[0].mediaKey)

        postToMediaMap[p.id] = url || ''
      }
    })
  )
  return postToMediaMap
}

export const uploadMedia = async (media: File): Promise<string> => {
  const mediaKey = uuid() + media.name.replace(/\s/g, '-').toLowerCase()
  await Storage.put(mediaKey, media)
  return mediaKey
}

//==============================================================================
// Auth
//==============================================================================

export const getCurrentUser = async () => {
  try {
    const user: { [anyProps: string]: any } = await Auth.currentAuthenticatedUser()

    return {
      username: user.username,
      fullName: user.attributes.name,
      email: user.attributes.email,
    }
  } catch (error) {
    console.error({ clientGetCurrentUserError: error })
    throw error
  }
}

export const signUp = async ({ username, password, email, fullName }: APISignUpParam) => {
  try {
    await Auth.signUp({
      username,
      password,
      attributes: {
        email,
        name: fullName,
      },
    })
  } catch (error: any) {
    console.error({ clientSignUpError: error })
    throw new Error(getErrorMessage(error))
  }
}

export const login = async ({ username, password }: APILoginParam) => {
  try {
    const user: User = await Auth.signIn({ username, password })
    return user
  } catch (error: any) {
    console.error({ clientLoginError: error })
    throw new Error(getErrorMessage(error))
  }
}

export const logout = async () => {
  try {
    await DataStore.clear()
    await Auth.signOut()
  } catch (error) {
    console.error({ clientLogoutError: error })
    throw error
  }
}

//==============================================================================
// Client export
//==============================================================================

export const Client = {
  login,
  signUp,
  getCurrentUser,
  createPost,
  getPosts,
  deletePost,
  logout,
  getUserDetail,
  getUserPosts,
  searchUser,
  toggleLike,
}
