import { ViewRoute } from '../types'

const EditView = (): JSX.Element => {
  return <h1>Edit profile</h1>
}

export const editRoute: ViewRoute = {
  name: 'EditView',
  props: {
    path: 'edit',
    element: <EditView />,
  },
}
