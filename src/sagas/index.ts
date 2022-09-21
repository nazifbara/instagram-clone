import { all, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'

import { sagaTryCatch } from '../utils/helpers'
import { Client } from '../utils/client'
import { Profile } from '../models'
import {
  LoginFormState,
  SignUpFormState,
  User,
  NewPost,
  APIGetPostsParam,
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

export const _updateInfo = sagaTryCatch(
  async ({
    payload: { username, updates },
  }: PayloadAction<{ username: string; updates: ProfileUpdates }>) =>
    await Client.updateProfile(username, updates),
  updateInfoSuccess,
  updateInfoError
)

export const _updateProfilePhoto = sagaTryCatch(
  async ({ payload: { photo, username } }: PayloadAction<{ photo: File; username: string }>) =>
    await Client.uploadProfilePhoto(photo, username),
  updateProfilePhotoSuccess
)

export const _toggleLike = sagaTryCatch(
  async ({ payload: { postID, username } }: PayloadAction<{ postID: string; username: string }>) =>
    await Client.toggleLike(postID, username)
)

export const _searchProfile = sagaTryCatch(
  async ({ payload: username }: PayloadAction<string>) => await Client.searchUser(username),
  searchProfileSuccess,
  searchProfileError
)

const _getUserPosts = sagaTryCatch(
  async ({ payload }: PayloadAction<string>) => await Client.getUserPosts(payload),
  getUserPostsSuccess,
  getUserPostsError
)

const _loadProfile = sagaTryCatch(
  async ({ payload }: PayloadAction<string>) => await Client.getUserDetail(payload),
  loadProfileSuccess,
  loadProfileError
)

const _logout = sagaTryCatch(async () => await Client.logout(), logoutSuccess, logoutError)

export const _deletePost = sagaTryCatch(
  async ({ payload }: PayloadAction<string>) => await Client.deletePost(payload)
)

export const _loadPosts = sagaTryCatch(
  async ({ payload }: PayloadAction<APIGetPostsParam>) => await Client.getPosts(payload),
  loadPostsSuccess,
  loadPostsError
)

export const createNewPost = sagaTryCatch(
  async ({ payload }: PayloadAction<NewPost>) => await Client.createPost(payload),
  addPostSuccess,
  addPostError
)

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

export const signUpUser = sagaTryCatch(
  async ({ payload }: PayloadAction<SignUpFormState>) => await Client.signUp(payload),
  signUpSuccess,
  signUpError
)

export const loginUser = sagaTryCatch(
  async ({ payload }: PayloadAction<LoginFormState>) => await Client.login(payload),
  loginSuccess,
  loginError
)

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
