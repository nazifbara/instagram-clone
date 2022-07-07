import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UserState, User } from '../types'

const initialState: UserState = {
  userDetail: {
    data: null,
    isLoading: false,
    error: '',
  },
  searchResult: {
    data: null,
    isLoading: false,
    error: '',
  },
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    searchUser: (state, action: PayloadAction<string>) => {
      state.searchResult = {
        data: null,
        isLoading: true,
        error: '',
      }
    },

    searchUserSuccess: (state, { payload }: PayloadAction<User[] | null>) => {
      state.searchResult = {
        data: payload,
        isLoading: false,
        error: '',
      }
    },

    searchUserError: (state, { payload }: PayloadAction<string>) => {
      state.searchResult = {
        data: null,
        isLoading: false,
        error: payload,
      }
    },

    getUserDetail: (state, action: PayloadAction<string>) => {
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

export const {
  searchUser,
  searchUserSuccess,
  searchUserError,
  getUserDetail,
  getUserDetailError,
  getUserDetailSuccess,
} = userSlice.actions

export const userReducer = userSlice.reducer
