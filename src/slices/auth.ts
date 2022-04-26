import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CognitoUser } from '@aws-amplify/auth'

import { AuthState, LoginFormState } from '../types'

export const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  error: '',
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginFormState>) => {
      state.loading = true
    },

    loginSuccess: (state, { payload }: PayloadAction<CognitoUser>) => {
      state.currentUser = payload
      state.isAuthenticated = true
      state.loading = false
    },

    loginError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload
      state.isAuthenticated = false
      state.loading = false
    },
  },
})

export const { login, loginError, loginSuccess } = authSlice.actions

export const authReducer = authSlice.reducer
