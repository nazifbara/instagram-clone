import { all, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { Auth } from 'aws-amplify'

import { LoginFormState, SignUpFormState, User } from '../types'
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
    switch (error.code) {
      case 'UsernameExistsException':
        yield put(signUpError('That username is taken. Try another.'))
        break

      case 'InvalidParameterException':
        if (error.message.includes('password')) {
          yield put(signUpError('Password must be at least 8 characters long.'))
        } else {
          yield put(signUpError('Something went wrong...'))
        }
        break

      default:
        yield put(signUpError('Something went wrong...'))
        break
    }
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
  yield all([
    takeLatest(signUp.type, signUpUser),
    takeLatest(login.type, loginUser),
    takeLatest(checkAuth.type, getCurrentUser),
  ])
}
