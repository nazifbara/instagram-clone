import { Auth, DataStore, Predicates, SortDirection, Storage } from 'aws-amplify'

import { Post as PostModel, Media as MediaModel } from '../models'
import {
  APILoginParam,
  User,
  APISignUpParam,
  APICreatePostParam,
  PostToMediaMap,
  APIGetPostsParam,
} from '../types'
import {
  getErrorMessage,
  uploadMedia,
  getSignedMediaUrl,
  createMedia,
  mapPostsToMedias,
} from './helpers'

//==============================================================================
// Post
//==============================================================================

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
}
