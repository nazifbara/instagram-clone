import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  isAuthenticated: boolean
  component: any
}

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
}: PrivateRouteProps): JSX.Element => {
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }
  return <Component />
}
