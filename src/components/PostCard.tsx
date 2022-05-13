import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useSelector, useDispatch } from 'react-redux'

import { getAvatarURL } from '../utils/helpers'
import { deletePost, toggleLike } from '../slices/post'
import { getAuth } from '../selectors'
import { Link, Box, Avatar, Text, Icons, ActionDialog } from '.'
import { styled } from '../stitches.config'
import { Post } from '../types'
import { IconButton } from './IconButton'

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
  const isOwner = currentUser?.username === post.owner
  const isShortCaption = post.caption?.length && post.caption?.length <= 50
  const liked = post.likesMap ? Boolean(JSON.parse(post.likesMap)[currentUser?.username]) : false

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _deletePost = (postID: string) => () => dispatch(deletePost(postID))
  const _toggleLike = (postID: string, username: string) =>
    dispatch(toggleLike({ postID, username }))

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const showFullCaption = () => setMore(true)
  const handleLike = () => _toggleLike(post.id, currentUser?.username)

  return (
    <StyledPost {...otherProps}>
      <Box css={{ p: '0.875rem 1rem', display: 'flex', alignItems: 'center' }}>
        <Avatar
          size="2rem"
          src={getAvatarURL(post.owner)}
          fallback="u"
          alt={post.owner || 'some user'}
        />
        <Link to={`/app/${post.owner}`} css={{ ml: '0.875rem' }}>
          {post.owner}
        </Link>
        <Box css={{ flexGrow: 1 }} />

        {isOwner && (
          <ActionDialog.Root>
            <IconButton as={ActionDialog.Trigger} css={{ color: '$textBase' }}>
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

      <img src={media} alt="" />

      <Box as="section" css={{ p: '0.875rem 1rem' }}>
        <StyledActionBox>
          <StyledActionButton onClick={handleLike}>
            <Icons.Like liked={liked} />
          </StyledActionButton>
        </StyledActionBox>
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
const StyledActionBox = styled('div', { py: '0.375rem' })

const StyledActionButton = styled(IconButton, {
  '&:hover svg': {
    opacity: '0.6',
  },
})

const StyledPost = styled('article', {
  backgroundColor: '$accentBg',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '3px',
  border: '1px solid $grayBorder',
  mb: '1.5rem',
})
