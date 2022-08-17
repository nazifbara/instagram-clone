import { EditForm } from '../components'
import { ViewRoute } from '../types'

const EditView = (): JSX.Element => {
  return <EditForm />
}

export const editRoute: ViewRoute = {
  name: 'EditView',
  props: {
    path: 'edit',
    element: <EditView />,
  },
}
