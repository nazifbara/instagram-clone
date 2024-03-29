import { RouteProps } from 'react-router-dom'
import { Post as PostModel, Profile } from '../models'

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

export interface SearchProfileState {
  data: Profile[] | null
  isLoading: boolean
  error: string | null
}

export interface ProfileState {
  otherProfile: Profile | null
  currentProfile: Profile | null
  isLoading: boolean
  updatingPhoto: boolean
  updatingInfo: boolean
  error: string | null
}

export interface ProfileUpdates {
  fullName?: string | null
  bio?: string | null
  website?: string | null
}

export interface UserState {
  uploadingPhoto: boolean
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
  searchProfileState: SearchProfileState
  profileState: ProfileState
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

export interface ProfilePhoto {
  photoKey: string
  photoLink: string
}

export interface User {
  username: string
  fullName: string
  email: string
  bio?: string
  website?: string
  photoKey?: string
  photoLink?: string
}

//==============================================================================
// Routes
//==============================================================================

export interface ViewRoute {
  name: string
  props: RouteProps
}
