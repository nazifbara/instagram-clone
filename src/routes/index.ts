import { signInRoute } from './SignInView'
import { signUpRoute } from './SignUp'
import { profileRoute } from './Profile'
import { homeRoute } from './Home'

const routes = {
  privateRoutes: [profileRoute, homeRoute],
  publicRoutes: [signInRoute, signUpRoute],
}

export default routes
