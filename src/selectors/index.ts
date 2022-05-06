import { RootState } from '../types'

export const getUser = (state: RootState) => state.userState
export const getPost = (state: RootState) => state.postState
export const getAuth = (state: RootState) => state.authState
