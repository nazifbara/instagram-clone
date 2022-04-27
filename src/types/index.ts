import { RouteProps } from 'react-router-dom'

//==============================================================================
// State
//==============================================================================

export interface LoginFormState {
  username: string
  password: string
}

export interface AuthState {
  loading: boolean
  checking: boolean
  currentUser: User | null
  isAuthenticated: boolean
  error?: string
}

export interface RootState {
  authState: AuthState
}

//==============================================================================
// Posts
//==============================================================================

export interface Post {
  id: string
  owner: User
  media: string
  caption: string
  likeCount: number
}

//==============================================================================
// Users
//==============================================================================

export interface User {
  [anyProp: string]: any
}

//==============================================================================
// Routes
//==============================================================================

export interface ViewRoute {
  name: string
  props: RouteProps
}
