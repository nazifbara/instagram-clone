import { RouteProps } from 'react-router-dom'

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
