import { v4 as uuid } from 'uuid'
import { all, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { Auth, Storage, DataStore, Predicates, SortDirection } from 'aws-amplify'

import { Post as PostModel, Media as MediaModel } from '../models'
import { getErrorMessage } from '../utils/helpers'
import { CreateMediaInput } from '../API'
import { LoginFormState, SignUpFormState, User, NewPost, PostToMediaMap } from '../types'
import {
  deletePost,
  loadPosts,
  loadPostsError,
  loadPostsSuccess,
  addPostSuccess,
  addPostError,
  addPost,
} from '../slices/post'
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

function* _deletePost({ payload: postID }: PayloadAction<string>) {
  try {
    const postMedias: MediaModel[] = yield DataStore.query(MediaModel, (m) =>
      m.postID('eq', postID)
    )
    yield DataStore.delete(PostModel, (p) => p.id('eq', postID))
    yield Promise.all(postMedias.map(async (m) => await Storage.remove(m.mediaKey)))
  } catch (error) {
    console.error({ deletePostErrro: error })
  }
}

function* fetchPosts() {
  try {
    const posts: PostModel[] = yield DataStore.query(PostModel, Predicates.ALL, {
      sort: (s) => s.createdAt(SortDirection.DESCENDING),
    })
    console.log({ posts })
    if (posts) {
      let postToMediaMap: PostToMediaMap = {}
      yield Promise.all(
        posts.map(async (p) => {
          const medias: MediaModel[] = (await DataStore.query(MediaModel)).filter(
            (m) => m.postID === p.id
          )

          const url = await getSignedMediaUrl(medias[0].mediaKey)

          postToMediaMap[p.id] = url || ''
        })
      )

      yield put(loadPostsSuccess({ posts: posts, postToMediaMap }))
    }
  } catch (error) {
    console.error(error)
    yield put(loadPostsError(getErrorMessage(error)))
  }
}

const getSignedMediaUrl = async (key: string | undefined) => {
  if (!key) {
    return
  }
  return await Storage.get(key)
}

function* createNewPost({ payload: { postInput, medias, owner } }: PayloadAction<NewPost>) {
  console.log(postInput)

  try {
    const post: PostModel = yield DataStore.save(new PostModel({ caption: postInput.caption }))
    console.log(post)
    let postToMediaMap: PostToMediaMap = {}

    const result: MediaModel[] = yield Promise.all(
      medias.map(async (file) => {
        const key = await uploadMedia(file)
        const url = await getSignedMediaUrl(key)
        postToMediaMap[post.id] = url || ''
        return await _createMedia({ postID: post.id, mediaKey: key })
      })
    )

    console.info('New post created!')
    result.forEach((m) => {
      if (!m) {
        return
      }
      post.Media?.push(m)
    })

    yield put(addPostSuccess({ post: { ...post, owner }, postToMediaMap }))
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

const _createMedia = async ({ postID, mediaKey }: CreateMediaInput) => {
  return await DataStore.save(new MediaModel({ postID, mediaKey }))
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
    takeLatest(deletePost.type, _deletePost),
    takeLatest(loadPosts.type, fetchPosts),
    takeLatest(addPost.type, createNewPost),
    takeLatest(signUp.type, signUpUser),
    takeLatest(login.type, loginUser),
    takeLatest(checkAuth.type, getCurrentUser),
  ])
}
