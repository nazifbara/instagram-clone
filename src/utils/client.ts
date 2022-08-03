import { Auth, DataStore } from 'aws-amplify'

import { Post as PostModel, Media as MediaModel } from '../models'
import { APILoginParam, User, APISignUpParam, APICreatePostParam, PostToMediaMap } from '../types'
import { getErrorMessage, uploadMedia, getSignedMediaUrl, createMedia } from './helpers'

//==============================================================================
// Post
//==============================================================================

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

//==============================================================================
// Client export
//==============================================================================

export const Client = {
  login,
  signUp,
  getCurrentUser,
  createPost,
}
