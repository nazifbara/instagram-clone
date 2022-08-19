import { Auth, DataStore, Predicates, SortDirection, Storage } from 'aws-amplify'
import { v4 as uuid } from 'uuid'

import { Post as PostModel, Media as MediaModel, Profile } from '../models'
import {
  ProfileUpdates,
  APILoginParam,
  User,
  APISignUpParam,
  APICreatePostParam,
  PostToMediaMap,
  APIGetPostsParam,
  Post,
  ProfilePhoto,
} from '../types'
import { getErrorMessage, createMedia, updateLikesMap } from './helpers'

//==============================================================================
// User
//==============================================================================

export const getProfileByUsername = async (username: string): Promise<Profile | undefined> => {
  try {
    return (await DataStore.query(Profile, (p) => p.username('eq', username)))[0]
  } catch (error) {
    console.error({ getProfileByUsername: error })
    throw getErrorMessage(error)
  }
}

export const updateProfile = async (username: string, updates: ProfileUpdates) => {
  try {
    const profile = await getUserDetail(username)
    if (profile) {
      return await DataStore.save(
        Profile.copyOf(profile, (updated) => {
          updated.bio = updates.bio
          updated.website = updates.website
          updated.fullName = updates.fullName
        })
      )
    }
    return profile
  } catch (error) {
    console.error({ updateProfileError: error })
    throw new Error(getErrorMessage(error))
  }
}

export const uploadProfilePhoto = async (photo: File, username: string): Promise<ProfilePhoto> => {
  try {
    const key = uuid() + photo.name.replace(/\s/g, '-').toLowerCase()
    const link = `https://instagramclone-storage-05ea56e8123606-dev.s3.eu-west-2.amazonaws.com/public/profiles-photos/${key}`
    const profile = await DataStore.query(Profile, (p) => p.username('eq', username))

    await Storage.remove(`profiles-photos/${profile[0].photoKey}`)
    await Storage.put(`profiles-photos/${key}`, photo)

    await DataStore.save(
      Profile.copyOf(profile[0], (updated) => {
        updated.photoKey = key
        updated.photoLink = link
      })
    )

    return {
      photoKey: key,
      photoLink: link,
    }
  } catch (error) {
    console.error({ uploadProfilePhotoError: error })
    throw new Error(getErrorMessage(error))
  }
}

export const searchUser = async (username: string) => {
  try {
    return await DataStore.query(Profile, (p) => p.username('contains', username))
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
  getProfileByUsername,
  updateProfile,
  uploadProfilePhoto,
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
