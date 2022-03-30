import { RouteProps } from 'react-router-dom'

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
