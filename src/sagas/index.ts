import { v4 as uuid } from 'uuid'
import { all, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify'

import { getErrorMessage } from '../utils/helpers'
import { CreateMediaInput, CreateMediaMutation, CreatePostMutation } from '../API'
import { createPost, createMedia } from '../graphql/mutations'
import { LoginFormState, SignUpFormState, User, NewPost } from '../types'
import { addPostSuccess, addPostError, addPost } from '../slices/post'
import {
  signUp,
  signUpSuccess,
  signUpError,
  login,
  loginSuccess,
  loginError,
  checkAuth,
  checkAuthSuccess,
  checkAuthError,
} from '../slices/auth'

function* createNewPost({ payload: { postInput, medias } }: PayloadAction<NewPost>) {
  console.log(postInput)

  try {
    const post: { data: CreatePostMutation } = yield API.graphql({
      ...graphqlOperation(createPost, { input: postInput }),
    })
    console.log(post)
    const result: [{ data: CreateMediaMutation }] = yield Promise.all(
      medias.map(async (file) => {
        const key = await uploadMedia(file)
        return await _createMedia({ postID: post.data.createPost?.id || '', mediaKey: key })
      })
    )
    console.info('New post created!')
    result.forEach((m) => {
      if (!m.data.createMedia) {
        return
      }
      post.data.createPost?.Media?.items.push(m.data.createMedia)
    })

    if (post.data.createPost) {
      yield put(addPostSuccess(post.data.createPost))
    }
  } catch (error: any) {
    console.error({ createNewPostError: error })
    yield put(addPostError(getErrorMessage(error)))
  }
}

const uploadMedia = async (media: File): Promise<string> => {
  const mediaKey = uuid() + media.name.replace(/\s/g, '-').toLowerCase()
  await Storage.put(mediaKey, media)
  return mediaKey
}

const _createMedia = async (input: CreateMediaInput) => {
  console.log(input)

  return await API.graphql(graphqlOperation(createMedia, { input }))
}

function* getCurrentUser() {
  try {
    const user: User = yield Auth.currentAuthenticatedUser()
    console.log(user)
    yield put(checkAuthSuccess(user))
  } catch (error) {
    yield put(checkAuthError())
  }
}

function* signUpUser({
  payload: { username, password, email, fullName },
}: PayloadAction<SignUpFormState>) {
  try {
    const { user } = yield Auth.signUp({
      username,
      password,
      attributes: {
        email,
        name: fullName,
      },
    })
    console.info({ userSignedUp: user })
    yield put(signUpSuccess())
  } catch (error: any) {
    console.error({ signUpError: error })
    yield put(signUpError(getErrorMessage(error)))
  }
}

function* loginUser({ payload: { username, password } }: PayloadAction<LoginFormState>) {
  try {
    const user: User = yield Auth.signIn({ username, password })
    console.info({ signedInUser: user })
    yield put(loginSuccess(user))
  } catch (error: any) {
    console.error({ signInError: error })
    yield put(loginError(getErrorMessage(error)))
  }
}

export function* rootSaga() {
  yield all([
    takeLatest(addPost.type, createNewPost),
    takeLatest(signUp.type, signUpUser),
    takeLatest(login.type, loginUser),
    takeLatest(checkAuth.type, getCurrentUser),
  ])
}
