import { useState } from 'react'

import { Link, Box, Avatar, Text, Icons } from '.'
import { styled } from '../stitches.config'
import { Post } from '../types'
import { IconButton } from './IconButton'

type PostCardProps = {
  post: Post
  media: string
}

export const PostCard = ({ post, media, ...otherProps }: PostCardProps): JSX.Element => {
  const [more, setMore] = useState(false)

  const showFullCaption = () => setMore(true)

  return (
    <StyledPost {...otherProps}>
      <Box css={{ p: '0.875rem 1rem', display: 'flex', alignItems: 'center' }}>
        <Avatar size="2rem" src="" fallback="u" alt={post.owner ?? ''} />
        <Link to={`/app/${post.owner}`} css={{ ml: '0.875rem' }}>
          {post.owner}
        </Link>
      </Box>
      <img src={media} alt="" />
      <Box as="section" css={{ p: '0.875rem 1rem' }}>
        <StyledActionBox>
          <StyledActionButton>
            <Icons.Like />
          </StyledActionButton>
        </StyledActionBox>
        <Box css={{ mb: '0.5rem' }}>
          <Text bold>{post.likeCount} likes</Text>
        </Box>
      </Box>
      {post.caption && (
        <Box css={{ p: '0 0.875rem 1rem 0.875rem', '&>*': { display: 'inline' } }}>
          <Text bold>{post.owner} </Text>
          <Text as="p">{more ? post.caption : post.caption.slice(0, 30) + '...'}</Text>
          {!more && (
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
