import { useState, useEffect } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useSelector, useDispatch } from 'react-redux'

import { Client } from '../../utils/client'
import { deletePost } from '../../slices/post'
import { getAuth } from '../../selectors'
import { Link, Box, Avatar, Text, ActionDialog, IconButton, PostActionBar } from '..'
import { styled } from '../../stitches.config'
import { Post } from '../../types'
import { Profile } from '../../models'

type PostCardProps = {
  post: Post
  media: string
}

export const PostCard = ({ post, media, ...otherProps }: PostCardProps): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { currentUser } = useSelector(getAuth)

  // ===========================================================================
  // State
  // ===========================================================================

  const [more, setMore] = useState(false)
  const [profile, setProfile] = useState<Profile | undefined>(undefined)
  const isOwner = currentUser?.username === post.owner
  const isShortCaption = post.caption?.length && post.caption?.length <= 50

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _deletePost = (postID: string) => () => dispatch(deletePost(postID))

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    if (post.owner) {
      Client.getProfileByUsername(post.owner).then(setProfile)
    }
  }, [post.owner])

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const showFullCaption = () => setMore(true)

  return (
    <StyledPost {...otherProps}>
      <Box css={{ p: '0.875rem 1rem', display: 'flex', alignItems: 'center' }}>
        <Avatar
          size="2rem"
          src={profile?.photoLink || ''}
          fallback="u"
          alt={post.owner || 'some user'}
        />
        <Link to={`/app/${post.owner}`} css={{ ml: '0.875rem' }}>
          {post.owner}
        </Link>
        <Box css={{ flexGrow: 1 }} />

        {isOwner && (
          <ActionDialog.Root>
            <IconButton
              aria-label="more options"
              as={ActionDialog.Trigger}
              css={{ color: '$textBase' }}
            >
              <DotsHorizontalIcon fontSize="18px" />
            </IconButton>
            <ActionDialog.Content>
              <ActionDialog.Option kind="danger" onClick={_deletePost(post.id)}>
                Delete
              </ActionDialog.Option>
            </ActionDialog.Content>
          </ActionDialog.Root>
        )}
      </Box>

      <img aria-label="Post media" src={media} alt="" />

      <Box as="section" css={{ p: '0.875rem 1rem' }}>
        <PostActionBar post={post} />

        <Box css={{ mb: '0.5rem' }}>
          <Text bold>{post.likeCount || 0} likes</Text>
        </Box>
      </Box>
      {post.caption && (
        <Box css={{ p: '0 0.875rem 1rem 0.875rem', '&>*': { display: 'inline' } }}>
          <Text bold>{post.owner} </Text>

          {isShortCaption && <Text as="p">{post.caption}</Text>}

          {!isShortCaption && (
            <Text as="p">{more ? post.caption : post.caption.slice(0, 50) + '...'}</Text>
          )}

          {!more && !isShortCaption && (
            <Box
              as="button"
              css={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
              onClick={showFullCaption}
            >
              <Text gray>more</Text>
            </Box>
          )}
        </Box>
      )}
    </StyledPost>
  )
}

const StyledPost = styled('article', {
  backgroundColor: '$accentBg',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '3px',
  border: '1px solid $grayBorder',
  mb: '1.5rem',
})
