import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Profile } from '../models'
import { ProfileState, ProfilePhoto, ProfileUpdates } from '../types'

const initialState: ProfileState = {
  otherProfile: null,
  currentProfile: null,
  isLoading: false,
  updatingPhoto: false,
  updatingInfo: false,
  error: null,
}

const profileSlice = createSlice({
  name: 'selectedProfile',
  initialState,
  reducers: {
    loadProfile: (state, _username: PayloadAction<string>) => {
      state.isLoading = true
    },

    loadProfileSuccess: (state, { payload }: PayloadAction<Profile>) => {
      state.otherProfile = payload
      state.isLoading = false
    },

    loadProfileError: (state, { payload }: PayloadAction<string>) => {
      state.otherProfile = null
      state.isLoading = false
      state.error = payload
    },

    setCurrentUserProfile: (state, { payload }: PayloadAction<Profile>) => {
      state.currentProfile = payload
    },

    updateInfo: (state, _: PayloadAction<{ username: string; updates: ProfileUpdates }>) => {
      state.updatingInfo = true
    },

    updateInfoSuccess: (state, { payload }: PayloadAction<Profile>) => {
      state.updatingInfo = false
      state.currentProfile = payload
    },

    updateInfoError: (state, { payload }: PayloadAction<string>) => {
      state.updatingInfo = false
      state.error = payload
    },

    updateProfilePhoto: (state, _: PayloadAction<{ photo: File; username: string }>) => {
      state.updatingPhoto = true
    },

    updateProfilePhotoSuccess: (state, { payload }: PayloadAction<ProfilePhoto>) => {
      state.updatingPhoto = false

      if (state.currentProfile) {
        state.currentProfile = { ...state.currentProfile, ...payload }
      }
    },
  },
})

export const {
  loadProfile,
  setCurrentUserProfile,
  loadProfileSuccess,
  loadProfileError,
  updateProfilePhoto,
  updateProfilePhotoSuccess,
  updateInfo,
  updateInfoSuccess,
  updateInfoError,
} = profileSlice.actions

export const profileReducer = profileSlice.reducer
