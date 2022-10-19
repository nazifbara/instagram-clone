import { useCallback, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'

import { Container, Text, PostList } from '../'
import { getPosts } from '../../utils/client'

export const Feed = (): JSX.Element => {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } = useInfiniteQuery(
    ['feed-posts'],
    ({ pageParam = 0 }) => {
      return getPosts({ page: pageParam })
    },
    {
      getNextPageParam: (prevPage, pages) => (prevPage.hasNext ? pages.length : undefined),
    }
  )

  const intObserver = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useCallback(
    (post: HTMLLIElement) => {
      if (isLoading) return

      if (intObserver.current) intObserver.current.disconnect()

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      if (post) intObserver.current.observe(post)
    },
    [isLoading, fetchNextPage, hasNextPage]
  )

  return (
    <Container>
      {!isError && (
        <>
          {data?.pages.map((p) => (
            <PostList ref={lastPostRef} posts={p.posts} postToMediaMap={p.postToMediaMap} />
          ))}
        </>
      )}

      {isLoading && (
        <Text as="div" css={{ textAlign: 'center' }}>
          loading...
        </Text>
      )}

      {isError && (
        <Text as="div" css={{ textAlign: 'center', color: '$dangerSolid' }}>
          Something went wrong...
        </Text>
      )}
    </Container>
  )
}
