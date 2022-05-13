import { all, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { Auth, Storage, DataStore, Predicates, SortDirection, API } from 'aws-amplify'

import { Post as PostModel, Media as MediaModel } from '../models'
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

function* _toggleLike({
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

function* _searchUser({ payload: username }: PayloadAction<string>) {
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
    let result: { Users: User[] } = yield API.get(apiName, path, myInit)
    result.Users = result.Users.filter((u) =>
      u.Username.toLowerCase().includes(username.toLowerCase())
    )
    yield put(searchUserSuccess(result.Users))
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
    yield put(getUserPostsSuccess({ posts: posts, postToMediaMap }))
    console.log({ profilePosts: posts })
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
    const user: User = yield API.get(apiName, path, myInit)
    console.log({ userDetail: user })
    yield put(getUserDetailSuccess(user))
  } catch (error) {
    console.error({ userDetailError: error })
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
      let postToMediaMap: PostToMediaMap = yield mapPostsToMedias(posts)

      yield put(loadPostsSuccess({ posts: posts, postToMediaMap }))
    }
  } catch (error) {
    console.error(error)
    yield put(loadPostsError(getErrorMessage(error)))
  }
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

    yield put(addPostSuccess({ post: { ...post, owner }, postToMediaMap }))
  } catch (error: any) {
    console.error({ createNewPostError: error })
    yield put(addPostError(getErrorMessage(error)))
  }
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
    takeLatest(toggleLike.type, _toggleLike),
    takeLatest(searchUser.type, _searchUser),
    takeLatest(getUserPosts.type, _getUserPosts),
    takeLatest(getUserDetail.type, _getUserDetail),
    takeLatest(logout.type, _logout),
    takeLatest(deletePost.type, _deletePost),
    takeLatest(loadPosts.type, fetchPosts),
    takeLatest(addPost.type, createNewPost),
    takeLatest(signUp.type, signUpUser),
    takeLatest(login.type, loginUser),
    takeLatest(checkAuth.type, getCurrentUser),
  ])
}
