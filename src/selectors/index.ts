import { RootState } from '../types'

export const getPost = (state: RootState) => state.postState
export const getAuth = (state: RootState) => state.authState
