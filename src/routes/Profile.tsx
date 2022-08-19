import { MouseEventHandler, useState, useEffect, useCallback, ChangeEventHandler } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { useProfileByUsername } from '../utils/hooks'
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
  ActionDialog,
  IconButton,
  FileInput,
} from '../components'
import { getUserDetail, uploadProfilePhoto } from '../slices/user'
import { getUserPosts, deletePost } from '../slices/post'

const ProfileView = (): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { currentUser } = useSelector(getAuth)
  const { userDetail, uploadingPhoto } = useSelector(getUser)
  const { posts, error, isLoading, postToMediaMap } = useSelector(getPost)

  // ===========================================================================
  // State
  // ===========================================================================

  const [currentPostIndex, setCurrentPostIndex] = useState<number | null>(null)
  const [choosingPhoto, setChoosingPhoto] = useState<boolean>(false)
  const isOwner = currentUser?.username === userDetail.data?.username
  const postsCount = posts.length

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _uploadProfilePhoto = (photo: File, username: string) =>
    dispatch(uploadProfilePhoto({ photo, username }))
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

  const profile = useProfileByUsername(username)

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

  const handlePhotoSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && username) {
      _uploadProfilePhoto(e.target.files[0], username)
    }
    setChoosingPhoto(false)
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
              {isOwner ? (
                <ActionDialog.Root
                  open={choosingPhoto}
                  onOpenChange={(open) => setChoosingPhoto(open)}
                >
                  <IconButton as={ActionDialog.Trigger}>
                    <Avatar
                      isLoading={uploadingPhoto}
                      loadingMessage="uploading..."
                      css={{ wh: '77px', '@sm': { wh: '150px' } }}
                      src={userDetail.data?.photoLink || ''}
                      fallback="u"
                      alt={userDetail.data?.fullName ?? ''}
                    />
                  </IconButton>
                  <FileInput
                    id="photo-input"
                    type="file"
                    accept=".png,.jpeg"
                    data-testid="photo-input"
                    onChange={handlePhotoSelect}
                  />
                  <ActionDialog.Content>
                    <ActionDialog.Option as="label" kind="primary" htmlFor="photo-input">
                      Upload Photo
                    </ActionDialog.Option>
                  </ActionDialog.Content>
                </ActionDialog.Root>
              ) : (
                <Avatar
                  css={{ wh: '77px', '@sm': { wh: '150px' } }}
                  src={userDetail.data?.photoLink || ''}
                  fallback="u"
                  alt={userDetail.data?.fullName ?? ''}
                />
              )}
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

                {isOwner && (
                  <Button
                    as={Link}
                    to="/app/edit"
                    css={{ fontSize: '$2', width: '100%', ml: '0', '@sm': { ml: '1.25rem' } }}
                    type="simple"
                  >
                    Edit Profile
                  </Button>
                )}
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
                <Text as="p">{userDetail.data?.bio}</Text>
                <Link as="a" color="primary" href={userDetail.data?.website} target="_blank">
                  website
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
            <Text as="p">{userDetail.data?.bio}</Text>
            <Link as="a" color="primary" href={userDetail.data?.website} target="_blank">
              website
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
                  profile={profile}
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
