import { MouseEventHandler, useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { getAuth, getPost, getUser } from '../selectors'
import { ViewRoute } from '../types'
import {
  Link,
  Container,
  Box,
  Avatar,
  Text,
  Button,
  Separator,
  Icons,
  PostDialog,
  PostList,
} from '../components'
import { getUserDetail } from '../slices/user'
import { getUserPosts, deletePost } from '../slices/post'
import { getAvatarURL } from '../utils/helpers'

const ProfileView = (): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { currentUser } = useSelector(getAuth)
  const { userDetail } = useSelector(getUser)
  const { posts, error, isLoading, postToMediaMap } = useSelector(getPost)

  // ===========================================================================
  // State
  // ===========================================================================

  const [currentPostIndex, setCurrentPostIndex] = useState<number | null>(null)
  const isOwner = currentUser?.username === userDetail.data?.username
  const postsCount = posts.length

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
    if (currentPostIndex === posts.length - 1 || currentPostIndex === null) return
    setCurrentPostIndex(currentPostIndex + 1)
  }

  return (
    <Container>
      {userDetail.error && !userDetail.isLoading && (
        <Text css={{ color: '$dangerSolid' }}>{userDetail.error}</Text>
      )}

      {userDetail.isLoading && <Text>Loading</Text>}

      {!userDetail.isLoading && !userDetail.error && (
        <>
          <Box
            as="section"
            css={{
              display: 'flex',
              alignItems: 'flex-start',
              alignContent: 'center',
              mb: '1.75rem',

              '@md': {
                justifyContent: 'center',
              },
            }}
          >
            <Box
              css={{
                display: 'flex',
                justifyContent: 'flex-start',
                mr: '1.5rem',
                '@sm': {
                  justifyContent: 'center',
                  mr: '1.875rem',
                },

                '@md': {
                  mr: '2.5rem',
                },
              }}
            >
              <Avatar
                css={{ wh: '77px', '@sm': { wh: '150px' } }}
                src={getAvatarURL(userDetail.data?.username)}
                fallback="u"
                alt={userDetail.data?.fullName ?? ''}
              />
            </Box>

            <Box
              css={{
                display: 'flex',
                alignItems: 'center',
                '@sm': {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  '& > *': { mb: '1.25rem' },
                },
              }}
            >
              <Box
                css={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  '@sm': { flexDirection: 'row', alignItems: 'center' },
                }}
              >
                <Text
                  as="h2"
                  css={{ fontSize: '$5', fontWeight: 300, mb: '1rem', '@sm': { mb: '0' } }}
                >
                  {userDetail.data?.username}
                </Text>
                <Button
                  css={{ fontSize: '$2', width: '100%', ml: '0', '@sm': { ml: '1.25rem' } }}
                  type="simple"
                >
                  Edit Profile
                </Button>
              </Box>

              <Box
                as="ul"
                css={{
                  display: 'none',
                  '@sm': {
                    display: 'flex',
                    flexWrap: 'wrap',
                    fontSize: '$2',
                    textAlign: 'center',
                    '&>li': { mr: '1rem' },
                  },
                  '@md': { mr: '2.5rem', fontSize: '$3' },
                }}
              >
                <Box as="li">
                  <Text bold>{posts.length} </Text>
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

              <Box
                css={{
                  display: 'none',
                  fontSize: '$2',
                  maxWidth: '31.25rem',
                  '&>*': { mb: '0.5rem' },

                  '@sm': {
                    display: 'initial',
                  },

                  '@md': {
                    fontSize: '$3',
                  },
                }}
              >
                <Text as="div" bold>
                  {userDetail.data?.fullName}
                </Text>
                <Text as="p">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus commodo nunc
                  sed sagittis. Maecenas a lacus eu enim tempus faucibus. Fusce hendrerit tortor ac
                  massa volutpat, sed luctus lectus.
                </Text>
                <Link as="a" color="primary" href="https://www.nazifbara.com" target="_blank">
                  nazifbara.com
                </Link>
              </Box>
            </Box>
          </Box>

          <Box
            css={{
              fontSize: '$2',
              '&>*': { mb: '0.25rem' },
              '@sm': {
                display: 'none',
              },
            }}
          >
            <Text as="div" bold>
              {userDetail.data?.fullName}
            </Text>
            <Text as="p">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras cursus commodo nunc sed
              sagittis. Maecenas a lacus eu enim tempus faucibus. Fusce hendrerit tortor ac massa
              volutpat, sed luctus lectus.
            </Text>
            <Link as="a" color="primary" href="https://www.nazifbara.com" target="_blank">
              nazifbara.com
            </Link>
          </Box>
        </>
      )}

      <Separator css={{ display: 'none', my: '1.875rem', '@sm': { display: 'block' } }} />

      <Box
        as="ul"
        css={{
          display: 'flex',
          width: '100vw',
          justifyContent: 'space-around',
          py: '1rem',
          my: '1rem',
          transform: 'translateX(-0.5rem)',
          flexWrap: 'wrap',
          fontSize: '$2',
          textAlign: 'center',
          borderTop: '1px solid $grayBorder',
          borderBottom: '1px solid $grayBorder',

          '&>li': { display: 'flex', flexDirection: 'column' },
          '@sm': {
            display: 'none',
          },
        }}
      >
        <Box as="li">
          <Text bold>{posts.length} </Text>
          <Text gray>posts</Text>
        </Box>
        <Box as="li">
          <Text bold>0 </Text>
          <Text gray>followers</Text>
        </Box>
        <Box as="li">
          <Text bold>0 </Text>
          <Text gray>following</Text>
        </Box>
      </Box>

      {error && !isLoading && <Text css={{ color: '$dangerSolid' }}>{error}</Text>}

      {isLoading && <Text>Loading</Text>}

      {!userDetail.isLoading && !userDetail.error && (
        <>
          <Box css={{ display: 'none', '@md': { display: 'initial' } }}>
            <Box
              as="section"
              css={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridAutoRows: 'auto',
                gridGap: '0.5rem',
                alignItems: 'stretch',

                '@sm': {
                  gridGap: '1rem',
                },

                '@md': {
                  gridGap: '1.75rem',
                },
              }}
            >
              {posts.map((p, i) => (
                <Box
                  key={'profile-posts-' + p.id}
                  onClick={hanldePostClick(i)}
                  css={{
                    width: '100%',
                    aspectRatio: '1 / 1',
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
            <PostDialog.Root
              open={currentPostIndex !== null}
              onOpenChange={(o) => !o && setCurrentPostIndex(null)}
            >
              {currentPostIndex !== null && (
                <PostDialog.Content
                  isOwner={isOwner}
                  currentImgSrc={postToMediaMap[posts[currentPostIndex].id]}
                  post={posts[currentPostIndex]}
                  currentIndex={currentPostIndex}
                  lastIndex={postsCount - 1}
                  onBackClick={handleBackClick}
                  onNextClick={handleNextClick}
                  handlePostDelete={handlePostDelete}
                />
              )}
            </PostDialog.Root>
          </Box>

          <Box css={{ '@md': { display: 'none' } }}>
            <PostList posts={posts} postToMediaMap={postToMediaMap} />
          </Box>
        </>
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
