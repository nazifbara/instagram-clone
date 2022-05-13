import { MouseEventHandler, useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { getAuth, getPost, getUser } from '../selectors'
import { ViewRoute } from '../types'
import {
  ActionDialog,
  IconButton,
  Link,
  Container,
  Box,
  Avatar,
  Text,
  Button,
  Separator,
  Icons,
  Dialog,
} from '../components'
import { getUserDetail } from '../slices/user'
import { getUserPosts, deletePost } from '../slices/post'

const ProfileView = (): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { currentUser } = useSelector(getAuth)
  const { userDetail } = useSelector(getUser)
  const { userPosts, postToMediaMap } = useSelector(getPost)

  // ===========================================================================
  // State
  // ===========================================================================

  const [currentPostIndex, setCurrentPostIndex] = useState<number | null>(null)
  const isOwner = currentUser?.username === userDetail.data?.Username
  const postsCount = userPosts.data.length

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _deletePost = (postID: string) => dispatch(deletePost(postID))
  const _getUserDetail = useCallback(
    (username: string) => dispatch(getUserDetail(username)),
    [dispatch]
  )
  const _getUserPosts = useCallback(
    (username: string) => dispatch(getUserPosts(username)),
    [dispatch]
  )

  // ===========================================================================
  // Hooks
  // ===========================================================================

  const { username } = useParams()

  useEffect(() => {
    if (username) {
      _getUserDetail(username)
      _getUserPosts(username)
    }
  }, [username, _getUserDetail, _getUserPosts])

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const handlePostDelete = (id: string) => () => {
    if (currentPostIndex === 0 && postsCount === 1) setCurrentPostIndex(null)
    else if (currentPostIndex === postsCount - 1) setCurrentPostIndex(currentPostIndex - 1)
    _deletePost(id)
  }

  const hanldePostClick = (index: number) => () => setCurrentPostIndex(index)

  const handleBackClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (currentPostIndex === 0 || currentPostIndex === null) return
    setCurrentPostIndex(currentPostIndex - 1)
  }

  const handleNextClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (currentPostIndex === userPosts.data.length - 1 || currentPostIndex === null) return
    setCurrentPostIndex(currentPostIndex + 1)
  }

  return (
    <Container>
      {userDetail.error && !userDetail.isLoading && (
        <Text css={{ color: '$dangerSolid' }}>{userDetail.error}</Text>
      )}

      {userDetail.isLoading && <Text>Loading</Text>}

      {!userDetail.isLoading && !userDetail.error && (
        <Box as="section" css={{ display: 'flex', alignItems: 'flex-start' }}>
          <Box css={{ display: 'flex', flexGrow: 1, justifyContent: 'center', mr: '1.875rem' }}>
            <Avatar
              size="150px"
              src={currentUser?.avatar}
              fallback="u"
              alt={userDetail.data?.Username}
            />
          </Box>

          <Box css={{ flexGrow: 2, '& > *': { mb: '1.25rem' } }}>
            <Box css={{ display: 'Flex', alignItems: 'center' }}>
              <Text as="h2" css={{ fontSize: '$5', fontWeight: 300 }}>
                {userDetail.data?.Username}
              </Text>
              <Button css={{ ml: '1.25rem' }} type="simple">
                Edit Profile
              </Button>
            </Box>

            <Box as="ul" css={{ display: 'flex', fontSize: '$3', '&>li': { mr: '2.5rem' } }}>
              <Box as="li">
                <Text bold>{userPosts.data.length} </Text>
                <Text>posts</Text>
              </Box>
              <Box as="li">
                <Text bold>0 </Text>
                <Text>followers</Text>
              </Box>
              <Box as="li">
                <Text bold>0 </Text>
                <Text>following</Text>
              </Box>
            </Box>

            <Box css={{ fontSize: '$3', '&>*': { mb: '0.5rem' } }}>
              <Text as="div" bold>
                {userDetail.data?.UserAttributes[2].Value}
              </Text>
              <Text as="div">Bio here</Text>
              <Link as="a" color="primary" href="https://www.nazifbara.com" target="_blank">
                nazifbara.com
              </Link>
            </Box>
          </Box>
        </Box>
      )}

      <Separator css={{ my: '1.875rem' }} />

      {userPosts.error && !userPosts.isLoading && (
        <Text css={{ color: '$dangerSolid' }}>{userPosts.error}</Text>
      )}

      {userPosts.isLoading && <Text>Loading</Text>}

      {!userDetail.isLoading && !userDetail.error && (
        <Box>
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
            {userPosts.data.map((p, i) => (
              <Box
                key={'profile-posts-' + p.id}
                onClick={hanldePostClick(i)}
                css={{
                  height: '18.125rem',
                  cursor: 'pointer',
                  border: 'none',
                  p: '0',
                  color: 'inherit',
                  backgroundImage: `url(${postToMediaMap[p.id]})`,
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
            ))}
          </Box>
          <Dialog.Root
            open={currentPostIndex !== null}
            onOpenChange={(o) => !o && setCurrentPostIndex(null)}
          >
            {currentPostIndex !== null && (
              <Dialog.Content
                navigation={true}
                currentIndex={currentPostIndex}
                lastIndex={userPosts.data.length - 1}
                onBackClick={handleBackClick}
                onNextClick={handleNextClick}
                css={{ width: '85%', height: '95%', borderRadius: '0 0.75rem 0.75rem 0' }}
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
                      backgroundImage: `url("${
                        postToMediaMap[userPosts.data[currentPostIndex].id]
                      }")`,
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
                        src=""
                        fallback="p"
                        alt={userDetail.data?.Username}
                        size="1.75rem"
                        css={{ marginRight: '0.75rem' }}
                      />
                      <Link to={`/app/${userDetail.data?.Username}`}>
                        {userDetail.data?.Username}
                      </Link>
                      <Box css={{ flexGrow: '1' }} />
                      {isOwner && (
                        <ActionDialog.Root>
                          <IconButton as={ActionDialog.Trigger} css={{ color: '$textBase' }}>
                            <DotsHorizontalIcon fontSize="18px" />
                          </IconButton>
                          <ActionDialog.Content>
                            <ActionDialog.Option
                              kind="danger"
                              onClick={handlePostDelete(userPosts.data[currentPostIndex].id)}
                            >
                              Delete
                            </ActionDialog.Option>
                          </ActionDialog.Content>
                        </ActionDialog.Root>
                      )}
                    </Box>
                    <Separator orientation="horizontal" />
                    <Box css={{ p: '0.875rem 1rem' }}>
                      <Box css={{ display: 'flex' }}>
                        <Box css={{ width: '2rem', mr: '1rem' }}>
                          <Avatar
                            size="1.75rem"
                            src=""
                            fallback="u"
                            alt={userDetail.data?.Username}
                          />
                        </Box>
                        <Box css={{ display: 'inline' }}>
                          <Text bold css={{ mr: '0.3125rem' }}>
                            {userDetail.data?.Username}
                          </Text>
                          <Text as="p" css={{ display: 'inline' }}>
                            {userPosts.data[currentPostIndex].caption}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Dialog.Content>
            )}
          </Dialog.Root>
        </Box>
      )}
    </Container>
  )
}

export const profileRoute: ViewRoute = {
  name: 'ProfileView',
  props: {
    path: ':username',
    element: <ProfileView />,
  },
}
