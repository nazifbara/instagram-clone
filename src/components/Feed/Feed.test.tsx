import { put, takeLatest } from 'redux-saga/effects'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import { Feed } from './Feed'
import {
  fireEvent,
  getSaga,
  render,
  screen,
  within,
  setupIntersectionObserverMock,
} from '../../utils/test'
import { loadPosts, loadPostsSuccess, loadPostsError } from '../../slices/post'
import { _loadPosts } from '../../sagas'

jest.mock('../../sagas')
const mockedLoadPosts = jest.mocked(_loadPosts, true)
setupIntersectionObserverMock()

describe('<Feed />', () => {
  it('renders list of posts', () => {
    const history = createMemoryHistory()
    const posts = [
      { id: '111', owner: 'zif', caption: "Zif's caption here!", likeCount: 20 },
      { id: '222', owner: 'ken', caption: "Ken's caption here!", likeCount: 400 },
      { id: '333', owner: 'ryu', caption: "Ryu's caption here!", likeCount: 300 },
    ]
    const username = 'zif'

    mockedLoadPosts.mockImplementation(function* () {
      yield put(loadPostsSuccess({ posts, postToMediaMap: {} }))
    })

    render(
      <Router location={history.location} navigator={history}>
        <Feed />
      </Router>,
      {
        preloadedState: {
          authState: {
            currentUser: { username },
          },
        },
        saga: getSaga([takeLatest(loadPosts.type, mockedLoadPosts)]),
      }
    )

    expect(mockedLoadPosts).toBeCalledTimes(1)

    const listItems = screen.queryAllByRole('listitem')

    expect(listItems).toHaveLength(posts.length)

    posts.forEach((post) => {
      expect(screen.getByRole('link', { name: post.owner })).toBeInTheDocument()
      expect(screen.getByText(post.caption)).toBeInTheDocument()
      expect(screen.getByText(`${post.likeCount} likes`)).toBeInTheDocument()
    })

    // toggle like button
    listItems.forEach((item, i) => {
      fireEvent.click(within(item).getByRole('button', { name: /like/i }))
      expect(screen.getByText(`${posts[i].likeCount + 1} likes`)).toBeInTheDocument()

      fireEvent.click(within(item).getByRole('button', { name: /like/i }))
      expect(screen.getByText(`${posts[i].likeCount} likes`)).toBeInTheDocument()
    })

    // owner can delete post
    const currentUserPost = listItems[posts.findIndex((p) => p.owner === username)]
    fireEvent.click(within(currentUserPost).getByRole('button', { name: /more option/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(currentUserPost).not.toBeInTheDocument()
  })

  it('notifies the user if there is an error', () => {
    const history = createMemoryHistory()
    const errorMessage = 'something went wrong...'

    mockedLoadPosts.mockImplementation(function* () {
      yield put(loadPostsError(errorMessage))
    })

    render(
      <Router location={history.location} navigator={history}>
        <Feed />
      </Router>,
      {
        saga: getSaga([takeLatest(loadPosts.type, mockedLoadPosts)]),
      }
    )

    expect(mockedLoadPosts).toBeCalledTimes(1)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })
})
