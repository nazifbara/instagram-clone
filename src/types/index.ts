import { RouteProps } from 'react-router-dom'
import { Post as PostModel } from '../models'
import { CreatePostInput } from '../API'

//==============================================================================
// State
//==============================================================================

export interface PostState {
  posts: Post[]
  postToMediaMap: PostToMediaMap
  isLoading: boolean
  isPosting: boolean
  postCreationSuccess: boolean
  error: string
}

export interface SignUpFormState {
  email: string
  fullName: string
  username: string
  password: string
}
export interface LoginFormState {
  username: string
  password: string
}

export interface AuthState {
  loading: boolean
  checking: boolean
  currentUser: User | null
  isAuthenticated: boolean
  signUpSuccess: boolean
  error?: string
}

export interface RootState {
  postState: PostState
  authState: AuthState
}

//==============================================================================
// Posts
//==============================================================================

export interface Post extends PostModel {
  owner?: string
}

export interface NewPost {
  postInput: CreatePostInput
  medias: File[]
  owner: string
}

export interface PostToMediaMap {
  [anyProps: string]: string
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
