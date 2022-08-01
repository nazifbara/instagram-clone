import { ForwardedRef, forwardRef } from 'react'
import { PostCard, Box } from '..'
import { Post, PostToMediaMap } from '../../types'

export const PostList = forwardRef(
  (
    {
      posts = [],
      postToMediaMap,
    }: {
      posts: Post[]
      postToMediaMap: PostToMediaMap
    },
    ref: ForwardedRef<HTMLLIElement>
  ): JSX.Element => {
    return (
      <Box as="ul" css={{ maxWidth: '29.375rem', m: '0 auto' }}>
        {posts.map((p, i) => {
          if (posts.length === i + 1) {
            return ref ? (
              <li ref={ref} key={p.id}>
                <PostCard post={p} media={postToMediaMap[p.id]} />
              </li>
            ) : (
              <li key={p.id}>
                <PostCard post={p} media={postToMediaMap[p.id]} />
              </li>
            )
          }
          return (
            <li key={p.id}>
              <PostCard post={p} media={postToMediaMap[p.id]} />
            </li>
          )
        })}
      </Box>
    )
  }
)
