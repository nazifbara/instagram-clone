import { useEffect, useCallback, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Container, Text, PostList } from '../'
import { getPost } from '../../selectors'
import { loadPosts } from '../../slices/post'

export const Feed = (): JSX.Element => {
  // ===========================================================================
  // States
  // ===========================================================================

  const [page, setPage] = useState(0)

  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { posts, hasNextPage, postToMediaMap, isLoading, error } = useSelector(getPost)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _loadPosts = useCallback(() => dispatch(loadPosts({ page })), [dispatch, page])

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    _loadPosts()
  }, [_loadPosts])

  const intObserver = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useCallback(
    (post) => {
      if (isLoading) return

      if (intObserver.current) intObserver.current.disconnect()

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          setPage((prev) => prev + 1)
        }
      })

      if (post) intObserver.current.observe(post)
    },
    [isLoading, hasNextPage]
  )

  return (
    <Container>
      {!error && <PostList ref={lastPostRef} posts={posts} postToMediaMap={postToMediaMap} />}

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
