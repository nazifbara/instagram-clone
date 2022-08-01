import { all, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { Auth, Storage, DataStore, Predicates, SortDirection, API } from 'aws-amplify'

import { Post as PostModel, Media as MediaModel } from '../models'
import { client } from '../utils/client'
import {
  getErrorMessage,
  getSignedMediaUrl,
  mapPostsToMedias,
  createMedia,
  uploadMedia,
  updateLikesMap,
} from '../utils/helpers'
import { LoginFormState, SignUpFormState, User, NewPost, PostToMediaMap, Post } from '../types'
import {
  searchUser,
  searchUserSuccess,
  searchUserError,
  getUserDetail,
  getUserDetailSuccess,
  getUserDetailError,
} from '../slices/user'
import {
  toggleLike,
  getUserPosts,
  getUserPostsSuccess,
  getUserPostsError,
  deletePost,
  loadPosts,
  loadPostsError,
  loadPostsSuccess,
  addPostSuccess,
  addPostError,
  addPost,
} from '../slices/post'
import {
  logout,
  logoutSuccess,
  logoutError,
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

export function* _toggleLike({
  payload: { postID, username },
}: PayloadAction<{ postID: string; username: string }>) {
  try {
    const post: PostModel = yield DataStore.query(PostModel, postID)

    const updates = updateLikesMap(post.likesMap, post.likeCount, username)

    yield DataStore.save(
      PostModel.copyOf(post, (updated) => {
        updated.likeCount = updates.likeCount
        updated.likesMap = updates.likesMap
      })
    )
  } catch (error) {
    console.error({ toogleLikeError: error })
  }
}

export function* _searchUser({ payload: username }: PayloadAction<string>) {
  try {
    const apiName = 'AdminQueries'
    const path = '/listUsers'
    const session: { [anyProps: string]: any } = yield Auth.currentSession()

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
    let result: { Users: { [anyProps: string]: any }[] } = yield API.get(apiName, path, myInit)

    result.Users = result.Users.filter((u) =>
      u.Username.toLowerCase().includes(username.toLowerCase())
    )
    yield put(
      searchUserSuccess(
        result.Users.length === 0
          ? null
          : result.Users.map((u) => ({
              username: u.Username,
              fullName: u.Attributes[2].Value,
              email: u.Attributes[3].Value,
            }))
      )
    )
  } catch (error) {
    console.error({ searchUserError: error })
    yield put(searchUserError(getErrorMessage(error)))
  }
}

function* _getUserPosts({ payload }: PayloadAction<string>) {
  try {
    let posts: Post[] = yield DataStore.query(PostModel)
    posts = posts.filter((p) => p.owner === payload)
    let postToMediaMap: PostToMediaMap = yield mapPostsToMedias(posts)
    yield put(getUserPostsSuccess({ username: payload, posts: posts, postToMediaMap }))
  } catch (error) {
    console.error({ profilePostsError: error })
    yield put(getUserPostsError(getErrorMessage(error)))
  }
}

function* _getUserDetail({ payload }: PayloadAction<string>) {
  try {
    const apiName = 'AdminQueries'
    const path = '/getUser'
    const session: { [anyProps: string]: any } = yield Auth.currentSession()

    const token = session.getAccessToken().getJwtToken()

    const myInit = {
      queryStringParameters: {
        username: payload,
        groupname: 'Users',
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }
    const cognitoUser: { [anyProps: string]: any } = yield API.get(apiName, path, myInit)

    yield put(
      getUserDetailSuccess({
        username: cognitoUser.Username,
        fullName: cognitoUser.UserAttributes[2].Value,
        email: cognitoUser.UserAttributes[3].Value,
      })
    )
  } catch (error: any) {
    console.error({ userDetailError: error })
    if (error.isAxiosError && error.response.data.message.includes('User does not exist')) {
      error.code = 'UserNotFoundException'
      error.message = 'User not found.'
    }
    yield put(getUserDetailError(getErrorMessage(error)))
  }
}

function* _logout() {
  try {
    yield DataStore.clear()
    yield Auth.signOut()
    yield put(logoutSuccess())
  } catch (error) {
    console.error({ logoutError: error })
    yield put(logoutError())
  }
}

export function* _deletePost({ payload: postID }: PayloadAction<string>) {
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

export function* _loadPosts({ payload: { page = 0 } }: PayloadAction<{ page: number }>) {
  try {
    const posts: PostModel[] = yield DataStore.query(PostModel, Predicates.ALL, {
      page,
      limit: 6,
      sort: (s) => s.createdAt(SortDirection.DESCENDING),
    })

    if (posts) {
      let postToMediaMap: PostToMediaMap = yield mapPostsToMedias(posts)

      yield put(loadPostsSuccess({ posts: posts, postToMediaMap }))
    }
  } catch (error) {
    console.error(error)
    yield put(loadPostsError(getErrorMessage(error)))
  }
}

export function* createNewPost({ payload: { postInput, medias, owner } }: PayloadAction<NewPost>) {
  try {
    const post: PostModel = yield DataStore.save(new PostModel({ caption: postInput.caption }))

    let postToMediaMap: PostToMediaMap = {}

    const result: MediaModel[] = yield Promise.all(
      medias.map(async (file) => {
        const key = await uploadMedia(file)
        const url = await getSignedMediaUrl(key)
        postToMediaMap[post.id] = url || ''
        return await createMedia({ postID: post.id, mediaKey: key })
      })
    )

    console.info('New post created!')
    result.forEach((m) => {
      if (!m) {
        return
      }
      post.Media?.push(m)
    })

    yield put(addPostSuccess({ username: owner, post: { ...post, owner }, postToMediaMap }))
  } catch (error: any) {
    console.error({ createNewPostError: error })
    yield put(addPostError(getErrorMessage(error)))
  }
}

function* getCurrentUser() {
  try {
    const user: { [anyProps: string]: any } = yield Auth.currentAuthenticatedUser()

    yield put(
      checkAuthSuccess({
        username: user.username,
        fullName: user.attributes.name,
        email: user.attributes.email,
      })
    )
  } catch (error) {
    console.error(error)
    yield put(checkAuthError())
  }
}

export function* signUpUser({
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

export function* loginUser({ payload }: PayloadAction<LoginFormState>) {
  try {
    const user: User = yield client.login(payload)
    yield put(loginSuccess(user))
  } catch (error: any) {
    yield put(loginError(error))
  }
}

export function* rootSaga() {
  yield all([
    takeLatest(toggleLike.type, _toggleLike),
    takeLatest(searchUser.type, _searchUser),
    takeLatest(getUserPosts.type, _getUserPosts),
    takeLatest(getUserDetail.type, _getUserDetail),
    takeLatest(logout.type, _logout),
    takeLatest(deletePost.type, _deletePost),
    takeLatest(loadPosts.type, _loadPosts),
    takeLatest(addPost.type, createNewPost),
    takeLatest(signUp.type, signUpUser),
    takeLatest(login.type, loginUser),
    takeLatest(checkAuth.type, getCurrentUser),
  ])
}
