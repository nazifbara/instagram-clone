import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { takeLatest, put } from 'redux-saga/effects'

import { SearchInput } from './SearchInput'
import { render, screen, getSaga, fireEvent } from '../../utils/test'
import { searchProfile, searchProfileSuccess, searchProfileError } from '../../slices/searchProfile'
import { _searchProfile } from '../../sagas'

global.ResizeObserver = require('resize-observer-polyfill')
global.DOMRect = class DOMRect {
  bottom: number = 0
  left: number = 0
  right: number = 0
  top: number = 0
  constructor(public x = 0, public y = 0, public width = 0, public height = 0) {}
  static fromRect(other?: DOMRectInit): DOMRect {
    return new DOMRect(other?.x, other?.y, other?.width, other?.height)
  }
  toJSON() {
    return JSON.stringify(this)
  }
}

jest.mock('../../sagas')
const mockedSearchProfileSaga = jest.mocked(_searchProfile, true)

describe('<SearchInput />', () => {
  it('renders the search input', () => {
    const history = createMemoryHistory()

    render(
      <Router location={history.location} navigator={history}>
        <SearchInput />
      </Router>
    )

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
        <SearchInput />
      </Router>,
      { saga: getSaga([takeLatest(searchProfile.type, mockedSearchProfileSaga)]) }
    )

    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'something' } })

    await Promise.all(
      users.map(async (user) => {
        expect(await screen.findByText(user.username)).toBeInTheDocument()
      })
    )
  })

  it('notifies when no users found', async () => {
    const history = createMemoryHistory()

    mockedSearchProfileSaga.mockImplementation(function* () {
      yield put(searchProfileSuccess(null))
    })

    render(
      <Router location={history.location} navigator={history}>
        <SearchInput />
      </Router>,
      { saga: getSaga([takeLatest(searchProfile.type, mockedSearchProfileSaga)]) }
    )

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
        <SearchInput />
      </Router>,
      { saga: getSaga([takeLatest(searchProfile.type, mockedSearchProfileSaga)]) }
    )

    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'something' } })

    expect(await screen.findByText(errorMessage)).toBeInTheDocument()
  })
})
