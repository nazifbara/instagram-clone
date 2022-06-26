import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

import { render, screen, getSaga, fireEvent } from '../../utils/test'
import { PostCard } from './PostCard'
import { _toggleLike, _deletePost } from '../../sagas'
import { toggleLike, deletePost } from '../../slices/post'
import { takeLatest } from 'redux-saga/effects'

jest.mock('../../sagas')

describe('<PostCard />', () => {
  it('renders the post card', () => {
    const history = createMemoryHistory()
    const post = { id: 'postID', owner: 'zif', caption: 'Caption here!', likeCount: 3 }
    const media = '/link/to/media'
    const currentUser = { username: 'bob' }
    const authStateOption = {
      preloadedState: {
        authState: {
          currentUser,
        },
      },
    }

    render(
      <Router location={history.location} navigator={history}>
        <PostCard post={post} media={media} />
      </Router>
    )

    expect(screen.getByRole('link', { name: post.owner })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /post media/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /like/i })).toBeInTheDocument()
    expect(screen.getByText(`${post.likeCount} likes`)).toBeInTheDocument()
    expect(screen.getByText(post.caption)).toBeInTheDocument()
    // "more options" button is only for the owner
    expect(screen.queryByRole('button', { name: /more options/i })).toBeNull()

    post.owner = currentUser.username

    render(
      <Router location={history.location} navigator={history}>
        <PostCard post={post} media={media} />
      </Router>,
      authStateOption
    )

    // shows the "more options" to the owner
    expect(screen.getByRole('button', { name: /more options/i })).toBeInTheDocument()
  })

  it('allows user to toggle the like button', () => {
    const history = createMemoryHistory()
    let post = { id: 'postID', owner: 'zif', caption: 'Caption here!', likeCount: 3 }
    const media = '/link/to/media'
    const mockedToggleLikeSaga = jest.mocked(_toggleLike, true)
    const username = 'bob'

    render(
      <Router location={history.location} navigator={history}>
        <PostCard post={post} media={media} />
      </Router>,
      {
        preloadedState: {
          authState: {
            currentUser: { username },
          },
        },
        saga: getSaga([takeLatest(toggleLike.type, mockedToggleLikeSaga)]),
      }
    )

    fireEvent.click(screen.getByRole('button', { name: /like/i }))

    expect(mockedToggleLikeSaga).toBeCalledTimes(1)
    expect(mockedToggleLikeSaga).toBeCalledWith(
      expect.objectContaining({ payload: { postID: post.id, username } })
    )
  })

  it('allows owner to delete post', async () => {
    const history = createMemoryHistory()
    let post = { id: '12kd3', owner: 'zif', caption: 'Caption here!', likeCount: 3 }
    const media = '/link/to/media'
    const mockedDeletePostSaga = jest.mocked(_deletePost, true)

    render(
      <Router location={history.location} navigator={history}>
        <PostCard post={post} media={media} />
      </Router>,
      {
        preloadedState: {
          authState: {
            currentUser: { username: post.owner },
          },
        },
        saga: getSaga([takeLatest(deletePost.type, mockedDeletePostSaga)]),
      }
    )

    fireEvent.click(screen.getByRole('button', { name: /more options/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // user can cancel
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /more options/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(mockedDeletePostSaga).toBeCalledTimes(1)
    expect(mockedDeletePostSaga).toBeCalledWith(expect.objectContaining({ payload: post.id }))
  })
})
