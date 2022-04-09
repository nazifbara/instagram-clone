import { useParams } from 'react-router-dom'

import { ViewRoute } from '../types'
import { Container, Box, Avatar, Text, Button, Separator, Icons, Dialog } from '../components'
import { currentUser, posts } from '../data'

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

      <Separator css={{ my: '1.875rem' }} />

      <Box
        as="section"
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoRows: 'auto',
          gridGap: '1.75rem',
          alignItems: 'stretch',
        }}
      >
        {posts.concat([...posts]).map((p, i) => (
          <Dialog.Root key={p.id + i}>
            <Box
              as={Dialog.Trigger}
              css={{
                height: '18.125rem',
                cursor: 'pointer',
                border: 'none',
                p: '0',
                color: 'inherit',
                backgroundImage: `url(${p.media})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                '&:hover > div': {
                  display: 'flex',
                },
              }}
            >
              <Box
                css={{
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%',
                  backgroundColor: '$blackA11',
                }}
              >
                <Icons.Like fill />
                <Box css={{ ml: '0.5rem', fontWeight: 600, fontSize: '$3' }}>{p.likeCount}</Box>
              </Box>
            </Box>
            <Dialog.Content
              css={{ width: '90%', height: '90%', borderRadius: '0 0.75rem 0.75rem 0' }}
            >
              <Box
                css={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                }}
              >
                <Box
                  css={{
                    height: '100%',
                    width: '62%',
                    display: 'flex',
                    backgroundImage: `url("${p.media}")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <Separator orientation="vertical" />
                <Box css={{ width: '38%' }}>
                  <Box
                    css={{ display: 'flex', alignItems: 'center', mx: '1rem', height: '3.75rem' }}
                  >
                    <Avatar
                      src={currentUser.avatar}
                      fallback="p"
                      alt={currentUser.username}
                      size="1.75rem"
                      css={{ marginRight: '0.75rem' }}
                    />
                    <Text bold>{currentUser.username}</Text>
                  </Box>
                  <Separator orientation="horizontal" />
                  <Box css={{ p: '0.875rem 1rem' }}>
                    <Box css={{ display: 'flex' }}>
                      <Box css={{ width: '2rem', mr: '1rem' }}>
                        <Avatar
                          size="1.75rem"
                          src={p.owner.avatar}
                          fallback="u"
                          alt={p.owner.username}
                        />
                      </Box>
                      <Box css={{ display: 'inline' }}>
                        <Text bold css={{ mr: '0.3125rem' }}>
                          {p.owner.username}
                        </Text>
                        <Text as="p" css={{ display: 'inline' }}>
                          {p.caption}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Dialog.Content>
          </Dialog.Root>
        ))}
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
