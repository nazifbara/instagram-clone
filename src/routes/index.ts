import { editRoute } from './Edit'
import { signInRoute } from './SignInView'
import { signUpRoute } from './SignUpView'
import { profileRoute } from './Profile'
import { homeRoute } from './Home'

const routes = {
  privateRoutes: [editRoute, profileRoute, homeRoute],
  publicRoutes: [signInRoute, signUpRoute],
}

export default routes
