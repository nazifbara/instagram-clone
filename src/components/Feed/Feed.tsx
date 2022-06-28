import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { PostCard, Container, Text } from '../'
import { getPost } from '../../selectors'
import { loadPosts } from '../../slices/post'

export const Feed = (): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { posts, postToMediaMap, isLoading, error } = useSelector(getPost)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _loadPosts = useCallback(() => dispatch(loadPosts()), [dispatch])

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    _loadPosts()
  }, [_loadPosts])

  return (
    <Container type="feed">
      <ul>
        {!error &&
          posts?.map((p) => (
            <li key={p.id}>
              <PostCard post={p} media={postToMediaMap[p.id]} />
            </li>
          ))}
      </ul>

      {isLoading && (
        <Text as="div" css={{ textAlign: 'center' }}>
          loading...
        </Text>
      )}

      {error && (
        <Text as="div" css={{ textAlign: 'center', color: '$dangerSolid' }}>
          {error}
        </Text>
      )}
    </Container>
  )
}
