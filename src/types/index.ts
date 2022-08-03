import { RouteProps } from 'react-router-dom'
import { Post as PostModel } from '../models'

//==============================================================================
// Client
//==============================================================================

export interface APIGetPostsParam {
  page?: number
}
export interface APICreatePostParam extends NewPost {}
export interface APISignUpParam extends SignUpFormState {}
export interface APILoginParam extends LoginFormState {}

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
    data: User[] | null
    isLoading: boolean
    error: string
  }
}

export interface PostState {
  posts: Post[]
  prevPage: number
  hasNextPage: boolean
  view: null | 'profile' | 'feed'
  profileUsername: null | string
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
  username: string
  fullName: string
  email: string
}

//==============================================================================
// Routes
//==============================================================================

export interface ViewRoute {
  name: string
  props: RouteProps
}
