import { ViewRoute } from '../types'

const HomeView = (): JSX.Element => {
  return <h1>Sweet Home</h1>
}

export const homeRoute: ViewRoute = {
  name: 'HomeView',
  props: {
    path: '/',
    element: <HomeView />,
  },
}
