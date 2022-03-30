import { useParams } from 'react-router-dom'

import { ViewRoute } from '../types'
import { Container } from '../components'

const ProfileView = (): JSX.Element => {
  const params = useParams()

  return (
    <Container>
      <p>{params.username} profile</p>
    </Container>
  )
}

export const profileRoute: ViewRoute = {
  name: 'ProfileView',
  props: {
    path: '/:username',
    element: <ProfileView />,
  },
}
