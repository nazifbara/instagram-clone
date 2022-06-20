import { ViewRoute } from '../types'
import { SignIn } from '../components'

const SignInView = (): JSX.Element => <SignIn />

export const signInRoute: ViewRoute = {
  name: 'SignInView',
  props: {
    path: '/auth/login',
    element: <SignInView />,
  },
}
