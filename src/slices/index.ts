import { combineReducers, Reducer } from 'redux'

import { userReducer } from './user'
import { postReducer } from './post'
import { authReducer } from '../slices/auth'
import { RootState } from '../types'

export const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  userState: userReducer,
  postState: postReducer,
  authState: authReducer,
})

export default rootReducer
