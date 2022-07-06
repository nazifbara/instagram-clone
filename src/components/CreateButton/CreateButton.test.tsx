import { all, put, takeLatest } from 'redux-saga/effects'

import { CreateButton } from './CreateButton'
import { render, screen, fireEvent } from '../../utils/test'
import { addPost, addPostError, addPostSuccess } from '../../slices/post'
import { createNewPost } from '../../sagas'

jest.mock('../../sagas')
const getSaga = (effects: unknown[]) =>
  function* () {
    yield all(effects)
  }
global.URL.createObjectURL = jest.fn(() => 'path/to/file')
const mockedCreateNewPost = jest.mocked(createNewPost, true)

describe('<CreateButton />', () => {
  it('renders post creation button', () => {
    render(<CreateButton />)

    expect(screen.getByRole('button', { name: /new post/i })).toBeInTheDocument()
  })

  it('opens a post creation dialog when the user click', () => {
    render(<CreateButton />)

    fireEvent.click(screen.getByRole('button', { name: /new post/i }))

    expect(screen.getByRole('dialog', { name: /create new post/i })).toBeInTheDocument()
    expect(screen.getByText(/choose a photo/i)).toBeInTheDocument()
    expect(screen.getByText(/select from computer/i)).toBeInTheDocument()

    // the user can close the dialog
    fireEvent.click(screen.getByRole('button', { name: /close/i }))

    expect(screen.queryByRole('dialog', { name: /create new post/i })).toBeNull()
  })

  it('moves to the caption step on photo select', () => {
    render(<CreateButton />)

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })

    fireEvent.click(screen.getByRole('button', { name: /new post/i }))
    fireEvent.change(screen.getByLabelText('Select from computer'), { target: { files: [file] } })

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/write a caption/i)).toBeInTheDocument()
  })

  it('can go back to select another file', () => {
    render(<CreateButton />)

    const file1 = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
    const file2 = new File(['(⌐□_□)'], 'eren.png', { type: 'image/jpeg' })

    fireEvent.click(screen.getByRole('button', { name: /new post/i }))
    fireEvent.change(screen.getByLabelText('Select from computer'), { target: { files: [file1] } })

    // go back
    fireEvent.click(screen.getByRole('button', { name: /back/i }))

    expect(screen.getByText(/choose a photo/i)).toBeInTheDocument()
    expect(screen.getByText(/select from computer/i)).toBeInTheDocument()

    // select another file
    fireEvent.change(screen.getByLabelText('Select from computer'), { target: { files: [file2] } })

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/write a caption/i)).toBeInTheDocument()
  })

  it('allows user to share a post with caption', () => {
    const currentUser = { username: 'zif' }

    render(<CreateButton />, {
      saga: getSaga([takeLatest(addPost.type, mockedCreateNewPost)]),
      preloadedState: {
        authState: {
          currentUser,
        },
      },
    })

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
    const caption = 'This is a caption'

    mockedCreateNewPost.mockImplementation(function* (_) {
      yield put(
        addPostSuccess({
          username: currentUser.username,
          post: { caption: '', id: '' },
          postToMediaMap: {},
        })
      )
    })

    fireEvent.click(screen.getByRole('button', { name: /new post/i }))
    fireEvent.change(screen.getByLabelText('Select from computer'), { target: { files: [file] } })
    fireEvent.change(screen.getByPlaceholderText(/write a caption/i), {
      target: { value: caption },
    })
    fireEvent.click(screen.getByRole('button', { name: /share/i }))

    expect(mockedCreateNewPost).toBeCalledTimes(1)
    expect(mockedCreateNewPost).toBeCalledWith(
      expect.objectContaining({
        payload: { medias: [file], postInput: { caption }, owner: currentUser.username },
      })
    )
    // it closes the dialog
    expect(screen.queryByRole('dialog', { name: /create new post/i })).toBeNull()
  })

  it('allows user to share a post without caption', () => {
    const currentUser = { username: 'zif' }

    render(<CreateButton />, {
      saga: getSaga([takeLatest(addPost.type, mockedCreateNewPost)]),
      preloadedState: {
        authState: {
          currentUser,
        },
      },
    })

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })

    mockedCreateNewPost.mockImplementation(function* (_) {
      yield put(
        addPostSuccess({
          username: currentUser.username,
          post: { caption: '', id: '' },
          postToMediaMap: {},
        })
      )
    })

    fireEvent.click(screen.getByRole('button', { name: /new post/i }))
    fireEvent.change(screen.getByLabelText('Select from computer'), { target: { files: [file] } })
    fireEvent.click(screen.getByRole('button', { name: /share/i }))

    expect(mockedCreateNewPost).toBeCalledTimes(1)
    expect(mockedCreateNewPost).toBeCalledWith(
      expect.objectContaining({
        payload: { medias: [file], postInput: { caption: '' }, owner: currentUser.username },
      })
    )

    // it closes the dialog
    expect(screen.queryByRole('dialog', { name: /create new post/i })).toBeNull()
  })

  it('notifies the user when there is an error', () => {
    render(<CreateButton />, {
      saga: getSaga([takeLatest(addPost.type, mockedCreateNewPost)]),
    })

    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })
    const errorMessage = 'Something went wrong'

    mockedCreateNewPost.mockImplementation(function* (_) {
      yield put(addPostError(errorMessage))
    })

    fireEvent.click(screen.getByRole('button', { name: /new post/i }))
    fireEvent.change(screen.getByLabelText('Select from computer'), { target: { files: [file] } })
    fireEvent.click(screen.getByRole('button', { name: /share/i }))

    expect(mockedCreateNewPost).toBeCalledTimes(1)
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })
})
