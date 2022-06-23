import { ViewRoute } from '../types'
import { SignUp } from '../components'

const SignUpView = (): JSX.Element => <SignUp />

export const signUpRoute: ViewRoute = {
  name: 'SignUpView',
  props: {
    path: '/auth/signup',
    element: <SignUpView />,
  },
}
