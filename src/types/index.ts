import { RouteProps } from 'react-router-dom'
import { CognitoUser } from '@aws-amplify/auth'

//==============================================================================
// State
//==============================================================================

export interface LoginFormState {
  username: string
  password: string
  globaleError: string
}

export interface AuthState {
  loading: boolean
  currentUser: CognitoUser | null
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
  id: string
  username: string
  name?: string
  avatar: string
}

//==============================================================================
// Routes
//==============================================================================

export interface ViewRoute {
  name: string
  props: RouteProps
}
