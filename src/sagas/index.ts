import { all, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { Auth, DataStore, API } from 'aws-amplify'

import { Post as PostModel } from '../models'
import { Client } from '../utils/client'
import { getErrorMessage, mapPostsToMedias, updateLikesMap } from '../utils/helpers'
import {
  LoginFormState,
  SignUpFormState,
  User,
  NewPost,
  PostToMediaMap,
  Post,
  APIGetPostsParam,
} from '../types'
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

export function* _deletePost({ payload }: PayloadAction<string>) {
  try {
    yield Client.deletePost(payload)
  } catch (error) {}
}

export function* _loadPosts({ payload }: PayloadAction<APIGetPostsParam>) {
  try {
    yield put(loadPostsSuccess(yield Client.getPosts(payload)))
  } catch (error: any) {
    yield put(loadPostsError(error.message))
  }
}

export function* createNewPost({ payload }: PayloadAction<NewPost>) {
  try {
    yield put(addPostSuccess(yield Client.createPost(payload)))
  } catch (error: any) {
    yield put(addPostError(error.message))
  }
}

function* getCurrentUser() {
  try {
    const user: User = yield Client.getCurrentUser()
    yield put(checkAuthSuccess(user))
  } catch (error) {
    yield put(checkAuthError())
  }
}

export function* signUpUser({ payload }: PayloadAction<SignUpFormState>) {
  try {
    yield Client.signUp(payload)
    yield put(signUpSuccess())
  } catch (error: any) {
    yield put(signUpError(error.message))
  }
}

export function* loginUser({ payload }: PayloadAction<LoginFormState>) {
  try {
    const user: User = yield Client.login(payload)
    yield put(loginSuccess(user))
  } catch (error: any) {
    yield put(loginError(error.message))
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
