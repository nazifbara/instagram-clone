import { combineReducers, Reducer } from 'redux'

import { searchProfileReducer } from './searchProfile'
import { profileReducer } from './profile'
import { postReducer } from './post'
import { authReducer } from '../slices/auth'
import { RootState } from '../types'

export const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  searchProfileState: searchProfileReducer,
  profileState: profileReducer,
  postState: postReducer,
  authState: authReducer,
})

export default rootReducer
