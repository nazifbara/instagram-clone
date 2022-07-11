import { PostCard, Box } from '..'
import { Post, PostToMediaMap } from '../../types'

export const PostList = ({
  posts = [],
  postToMediaMap,
}: {
  posts: Post[]
  postToMediaMap: PostToMediaMap
}): JSX.Element => (
  <Box as="ul" css={{ maxWidth: '29.375rem', m: '0 auto' }}>
    {posts.map((p) => (
      <li key={p.id}>
        <PostCard post={p} media={postToMediaMap[p.id]} />
      </li>
    ))}
  </Box>
)
