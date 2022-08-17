import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UserState, User, ProfilePhoto } from '../types'

const initialState: UserState = {
  uploadingPhoto: false,
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
    uploadProfilePhoto: (state, _: PayloadAction<{ photo: File; username: string }>) => {
      state.uploadingPhoto = true
    },

    uploadProfilePhotoSuccess: (state, { payload }: PayloadAction<ProfilePhoto>) => {
      state.uploadingPhoto = false

      if (state.userDetail.data) {
        state.userDetail.data = { ...state.userDetail.data, ...payload }
      }
    },

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
  uploadProfilePhoto,
  uploadProfilePhotoSuccess,
  searchUser,
  searchUserSuccess,
  searchUserError,
  getUserDetail,
  getUserDetailError,
  getUserDetailSuccess,
} = userSlice.actions

export const userReducer = userSlice.reducer
