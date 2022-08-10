import { all, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { Client } from '../utils/client'
import {
  LoginFormState,
  SignUpFormState,
  User,
  NewPost,
  APIGetPostsParam,
  ProfilePhoto,
} from '../types'
import {
  uploadProfilePhoto,
  uploadProfilePhotoSuccess,
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

export function* _uploadProfilePhoto({
  payload: { photo, username },
}: PayloadAction<{ photo: File; username: string }>) {
  try {
    const result: ProfilePhoto = yield Client.uploadProfilePhoto(photo, username)
    yield put(uploadProfilePhotoSuccess(result))
  } catch (error) {
    throw error
  }
}

export function* _toggleLike({
  payload: { postID, username },
}: PayloadAction<{ postID: string; username: string }>) {
  try {
    yield Client.toggleLike(postID, username)
  } catch (error) {}
}

export function* _searchUser({ payload: username }: PayloadAction<string>) {
  try {
    yield put(searchUserSuccess(yield Client.searchUser(username)))
  } catch (error: any) {
    yield put(searchUserError(error.message))
  }
}

function* _getUserPosts({ payload }: PayloadAction<string>) {
  try {
    yield put(getUserPostsSuccess(yield Client.getUserPosts(payload)))
  } catch (error: any) {
    yield put(getUserPostsError(error.message))
  }
}

function* _getUserDetail({ payload }: PayloadAction<string>) {
  try {
    yield put(getUserDetailSuccess(yield Client.getUserDetail(payload)))
  } catch (error: any) {
    yield put(getUserDetailError(error.message))
  }
}

function* _logout() {
  try {
    yield Client.logout()
    yield put(logoutSuccess())
  } catch (error) {
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
    takeLatest(uploadProfilePhoto.type, _uploadProfilePhoto),
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
