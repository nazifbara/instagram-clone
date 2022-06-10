import { RouteProps } from 'react-router-dom'
import { Post as PostModel } from '../models'

//==============================================================================
// State
//==============================================================================

export interface UserState {
  userDetail: {
    data: User | null
    isLoading: boolean
    error: string
  }
  searchResult: {
    data: User[]
    isLoading: boolean
    error: string
  }
}

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
  userState: UserState
  postState: PostState
  authState: AuthState
}

//==============================================================================
// Posts
//==============================================================================

export interface Post extends PostModel {
  owner?: string
}

export interface CreateMediaInput {
  postID: string
  mediaKey: string
}

export interface NewPost {
  postInput: {
    caption: string
  }
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
