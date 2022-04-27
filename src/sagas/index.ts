import { all, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { Auth } from 'aws-amplify'

import { LoginFormState, User } from '../types'
import {
  login,
  loginSuccess,
  loginError,
  checkAuth,
  checkAuthSuccess,
  checkAuthError,
} from '../slices/auth'

function* getCurrentUser() {
  try {
    const user: User = yield Auth.currentAuthenticatedUser()
    console.log(user)
    yield put(checkAuthSuccess(user))
  } catch (error) {
    yield put(checkAuthError())
  }
}

function* loginUser({ payload: { username, password } }: PayloadAction<LoginFormState>) {
  try {
    const user: User = yield Auth.signIn({ username, password })
    console.info({ signedInUser: user })
    yield put(loginSuccess(user))
  } catch (error: any) {
    console.error({ signInError: error })

    switch (error.code) {
      case 'UserNotFoundException':
      case 'NotAuthorizedException':
        yield put(loginError(error.message))
        break
      case 'NetworkError':
        yield put(loginError('Please check your internet connection and try again.'))
        break
      default:
        yield put(loginError('Something went wrong...'))
        break
    }
  }
}

export function* rootSaga() {
  yield all([takeLatest(login.type, loginUser), takeLatest(checkAuth.type, getCurrentUser)])
}
