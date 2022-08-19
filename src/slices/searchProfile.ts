import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Profile } from '../models'
import { SearchProfileState } from '../types'

const initialState: SearchProfileState = {
  data: null,
  isLoading: false,
  error: null,
}

const searchProfileSlice = createSlice({
  name: 'searchProfile',
  initialState,
  reducers: {
    searchProfile: (state, action: PayloadAction<string>) => {
      state.data = null
      state.isLoading = true
      state.error = null
    },

    searchProfileSuccess: (state, { payload }: PayloadAction<Profile[] | null>) => {
      state.data = payload
      state.isLoading = false
      state.error = null
    },

    searchProfileError: (state, { payload }: PayloadAction<string>) => {
      state.data = null
      state.isLoading = false
      state.error = payload
    },
  },
})

export const { searchProfile, searchProfileSuccess, searchProfileError } =
  searchProfileSlice.actions

export const searchProfileReducer = searchProfileSlice.reducer
