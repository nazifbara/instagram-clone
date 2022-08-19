import { RootState } from '../types'

export const getSearchProfile = (state: RootState) => state.searchProfileState
export const getProfile = (state: RootState) => state.profileState
export const getPost = (state: RootState) => state.postState
export const getAuth = (state: RootState) => state.authState
