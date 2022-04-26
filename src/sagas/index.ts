import { all, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { Auth } from 'aws-amplify'
import { CognitoUser } from '@aws-amplify/auth'

import { LoginFormState } from '../types'
import { login, loginSuccess, loginError } from '../slices/auth'

function* loginUser({ payload: { username, password } }: PayloadAction<LoginFormState>) {
  try {
    const user: CognitoUser = yield Auth.signIn({ username, password })
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
  yield all([takeLatest(login.type, loginUser)])
}
