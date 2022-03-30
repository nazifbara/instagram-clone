import { useParams } from 'react-router-dom'

import { ViewRoute } from '../types'
import { Container, Box, Avatar, Text, Button } from '../components'
import { currentUser } from '../data'

const ProfileView = (): JSX.Element => {
  const params = useParams()
  console.log(params.username)

  return (
    <Container>
      <Box as="section" css={{ display: 'flex', alignItems: 'flex-start' }}>
        <Box css={{ display: 'flex', flexGrow: 1, justifyContent: 'center', mr: '1.875rem' }}>
          <Avatar size="150px" src={currentUser.avatar} fallback="u" alt={currentUser.username} />
        </Box>

        <Box css={{ flexGrow: 2, '& > *': { mb: '1.25rem' } }}>
          <Box css={{ display: 'Flex', alignItems: 'center' }}>
            <Text as="h2" css={{ fontSize: '$5', fontWeight: 300 }}>
              {currentUser.username}
            </Text>
            <Button css={{ ml: '1.25rem' }} type="simple">
              Edit Profile
            </Button>
          </Box>

          <Box as="ul" css={{ display: 'flex', fontSize: '$3', '&>li': { mr: '2.5rem' } }}>
            <Box as="li">
              <Text bold>12 </Text>
              <Text>posts</Text>
            </Box>
            <Box as="li">
              <Text bold>30 </Text>
              <Text>followers</Text>
            </Box>
            <Box as="li">
              <Text bold>100 </Text>
              <Text>following</Text>
            </Box>
          </Box>

          <Box css={{ fontSize: '$3', '&>*': { mb: '0.5rem' } }}>
            <Text as="div" bold>
              {currentUser.name}
            </Text>
            <Text as="div">Frontend web developer (React js + AWS Amplify js)</Text>
            <Text
              as="a"
              bold
              css={{ textDecoration: 'none', color: '$blue9' }}
              href="https://www.nazifbara.com"
              target="_blank"
            >
              nazifbara.com
            </Text>
          </Box>
        </Box>
      </Box>
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
