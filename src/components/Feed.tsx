import { PostCard, Container } from '.'
import { posts } from '../data'

export const Feed = (): JSX.Element => {
  return (
    <Container type="feed">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </Container>
  )
}
