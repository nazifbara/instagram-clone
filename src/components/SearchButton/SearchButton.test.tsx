import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { takeLatest, put } from 'redux-saga/effects'

import { SearchButton } from './SearchButton'
import { render, screen, getSaga, fireEvent } from '../../utils/test'
import { searchProfile, searchProfileSuccess, searchProfileError } from '../../slices/searchProfile'
import { _searchProfile } from '../../sagas'

jest.mock('../../sagas')
const mockedSearchProfileSaga = jest.mocked(_searchProfile, true)

describe('<SearchButton />', () => {
  it('renders the search button', () => {
    const history = createMemoryHistory()

    render(
      <Router location={history.location} navigator={history}>
        <SearchButton />
      </Router>
    )

    expect(screen.getByRole('button')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('makes search suggestions', async () => {
    const history = createMemoryHistory()
    const users = [
      { id: '1', username: 'joe', fullName: 'Joe Doe' },
      { id: '2', username: 'bob', fullName: 'Bob Doe' },
      { id: '3', username: 'peter', fullName: 'Peter Doe' },
    ]

    mockedSearchProfileSaga.mockImplementation(function* () {
      yield put(searchProfileSuccess(users))
    })

    render(
      <Router location={history.location} navigator={history}>
        <SearchButton />
      </Router>,
      { saga: getSaga([takeLatest(searchProfile.type, mockedSearchProfileSaga)]) }
    )

    fireEvent.click(screen.getByRole('button'))
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'something' } })

    await Promise.all(
      users.map(async (user) => {
        expect(await screen.findByText(user.username)).toBeInTheDocument()
      })
    )

    expect(mockedSearchProfileSaga).toBeCalledTimes(1)
  })

  it('notifies when no users found', async () => {
    const history = createMemoryHistory()

    mockedSearchProfileSaga.mockImplementation(function* () {
      yield put(searchProfileSuccess(null))
    })

    render(
      <Router location={history.location} navigator={history}>
        <SearchButton />
      </Router>,
      { saga: getSaga([takeLatest(searchProfile.type, mockedSearchProfileSaga)]) }
    )

    fireEvent.click(screen.getByRole('button'))
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'something' } })

    expect(await screen.findByText(/no results found/i)).toBeInTheDocument()
  })

  it('notifies when this is an error', async () => {
    const history = createMemoryHistory()
    const errorMessage = 'Something went wrong...'

    mockedSearchProfileSaga.mockImplementation(function* () {
      yield put(searchProfileError(errorMessage))
    })

    render(
      <Router location={history.location} navigator={history}>
        <SearchButton />
      </Router>,
      { saga: getSaga([takeLatest(searchProfile.type, mockedSearchProfileSaga)]) }
    )

    fireEvent.click(screen.getByRole('button'))
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'something' } })

    expect(await screen.findByText(errorMessage)).toBeInTheDocument()
  })
})
