import { useDispatch, useSelector } from 'react-redux'

import { getAuth } from '../selectors'
import { toggleLike } from '../slices/post'
import { styled } from '../stitches.config'
import { Icons } from '.'
import { IconButton } from './IconButton'
import { Post } from '../models'

export const PostActionBar = ({ post }: { post: Post }): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { currentUser } = useSelector(getAuth)
  // ===========================================================================
  // State
  // ===========================================================================

  const liked = post.likesMap
    ? Boolean(JSON.parse(post.likesMap)[currentUser?.username ?? ''])
    : false

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _toggleLike = (postID: string, username: string) =>
    dispatch(toggleLike({ postID, username }))

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const handleLike = () => _toggleLike(post.id, currentUser?.username ?? '')

  return (
    <StyledActionBox>
      <StyledActionButton onClick={handleLike}>
        <Icons.Like liked={liked} />
      </StyledActionButton>
    </StyledActionBox>
  )
}

const StyledActionBox = styled('div', { py: '0.375rem' })
const StyledActionButton = styled(IconButton, {
  '&:hover svg': {
    opacity: '0.6',
  },
})
