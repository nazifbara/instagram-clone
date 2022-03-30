import { ViewRoute } from '../types'
import { Feed } from '../components'

const HomeView = (): JSX.Element => {
  return <Feed />
}

export const homeRoute: ViewRoute = {
  name: 'HomeView',
  props: {
    path: '/',
    element: <HomeView />,
  },
}
