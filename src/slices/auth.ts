import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AuthState, LoginFormState, User } from '../types'

export const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  signUpSuccess: false,
  error: '',
  loading: false,
  checking: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUp: (state, action: PayloadAction<LoginFormState>) => {
      state.loading = true
    },

    signUpSuccess: (state) => {
      state.signUpSuccess = true
      state.error = ''
      state.loading = false
    },

    signUpError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload
      state.signUpSuccess = false
      state.loading = false
    },

    signUpReset: (state) => {
      state.signUpSuccess = false
    },

    login: (state, action: PayloadAction<LoginFormState>) => {
      state.loading = true
    },

    loginSuccess: (state, { payload }: PayloadAction<User>) => {
      state.currentUser = payload
      state.error = ''
      state.isAuthenticated = true
      state.loading = false
    },

    loginError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload
      state.isAuthenticated = false
      state.loading = false
    },

    checkAuth: (state) => {
      state.checking = true
    },

    checkAuthSuccess: (state, { payload }: PayloadAction<User>) => {
      state.currentUser = payload
      state.isAuthenticated = true
      state.checking = false
    },

    checkAuthError: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.checking = false
    },
  },
})

export const {
  signUp,
  signUpSuccess,
  signUpError,
  signUpReset,
  login,
  loginError,
  loginSuccess,
  checkAuth,
  checkAuthSuccess,
  checkAuthError,
} = authSlice.actions

export const authReducer = authSlice.reducer
