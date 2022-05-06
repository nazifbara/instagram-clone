import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UserState, User } from '../types'

const initialState: UserState = {
  userDetail: {
    data: null,
    isLoading: false,
    error: '',
  },
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUserDetail: (state, { payload }: PayloadAction<string>) => {
      state.userDetail.isLoading = true
    },

    getUserDetailSuccess: (state, { payload }: PayloadAction<User>) => {
      state.userDetail = {
        data: payload,
        isLoading: false,
        error: '',
      }
    },

    getUserDetailError: (state, { payload }: PayloadAction<string>) => {
      state.userDetail = {
        data: null,
        isLoading: false,
        error: payload,
      }
    },
  },
})

export const { getUserDetail, getUserDetailError, getUserDetailSuccess } = userSlice.actions

export const userReducer = userSlice.reducer
