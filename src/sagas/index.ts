import { all, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { Client } from '../utils/client'
import { Profile } from '../models'
import {
  LoginFormState,
  SignUpFormState,
  User,
  NewPost,
  APIGetPostsParam,
  ProfilePhoto,
  ProfileUpdates,
} from '../types'
import { searchProfile, searchProfileSuccess, searchProfileError } from '../slices/searchProfile'
import {
  updateInfo,
  updateInfoSuccess,
  updateInfoError,
  loadProfile,
  loadProfileSuccess,
  loadProfileError,
  setCurrentUserProfile,
  updateProfilePhoto,
  updateProfilePhotoSuccess,
} from '../slices/profile'
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

export function* _updateInfo({
  payload: { username, updates },
}: PayloadAction<{ username: string; updates: ProfileUpdates }>) {
  try {
    const profile: Profile = yield Client.updateProfile(username, updates)
    yield put(updateInfoSuccess(profile))
  } catch (error: any) {
    yield put(updateInfoError(error.message))
  }
}

export function* _updateProfilePhoto({
  payload: { photo, username },
}: PayloadAction<{ photo: File; username: string }>) {
  try {
    const result: ProfilePhoto = yield Client.uploadProfilePhoto(photo, username)
    yield put(updateProfilePhotoSuccess(result))
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

export function* _searchProfile({ payload: username }: PayloadAction<string>) {
  try {
    yield put(searchProfileSuccess(yield Client.searchUser(username)))
  } catch (error: any) {
    yield put(searchProfileError(error.message))
  }
}

function* _getUserPosts({ payload }: PayloadAction<string>) {
  try {
    yield put(getUserPostsSuccess(yield Client.getUserPosts(payload)))
  } catch (error: any) {
    yield put(getUserPostsError(error.message))
  }
}

function* _loadProfile({ payload }: PayloadAction<string>) {
  try {
    const profile: Profile = yield Client.getUserDetail(payload)
    yield put(loadProfileSuccess(profile))
  } catch (error: any) {
    yield put(loadProfileError(error.message))
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
    const profile: Profile = yield Client.getProfileByUsername(user.username)
    yield put(setCurrentUserProfile(profile))
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
    takeLatest(updateInfo.type, _updateInfo),
    takeLatest(updateProfilePhoto.type, _updateProfilePhoto),
    takeLatest(toggleLike.type, _toggleLike),
    takeLatest(searchProfile.type, _searchProfile),
    takeLatest(getUserPosts.type, _getUserPosts),
    takeLatest(loadProfile.type, _loadProfile),
    takeLatest(logout.type, _logout),
    takeLatest(deletePost.type, _deletePost),
    takeLatest(loadPosts.type, _loadPosts),
    takeLatest(addPost.type, createNewPost),
    takeLatest(signUp.type, signUpUser),
    takeLatest(login.type, loginUser),
    takeLatest(checkAuth.type, getCurrentUser),
  ])
}
