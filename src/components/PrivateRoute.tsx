import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { getAuth } from '../selectors'

interface PrivateRouteProps {
  component: any
}

export const PrivateRoute = ({ component: Component }: PrivateRouteProps): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { isAuthenticated, checking } = useSelector(getAuth)

  if (checking) {
    return <div>loading</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }
  return <Component />
}
