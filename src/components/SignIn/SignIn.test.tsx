import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { all, put, takeLatest } from 'redux-saga/effects'

import { render, screen, fireEvent, act } from '../../utils/test'
import { SignIn } from './SignIn'
import { login, loginSuccess, loginError } from '../../slices/auth'
import { loginUser } from '../../sagas'

jest.mock('../../sagas')
const getSaga = (effects: unknown[]) =>
  function* () {
    yield all(effects)
  }
const mockedLoginUser = jest.mocked(loginUser, true)

describe('<SignIn />', () => {
  it('renders the sign in form', () => {
    const history = createMemoryHistory()

    render(
      <Router location={history.location} navigator={history}>
        <SignIn />
      </Router>
    )

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })

  it('requires a username', async () => {
    const history = createMemoryHistory()

    render(
      <Router location={history.location} navigator={history}>
        <SignIn />
      </Router>
    )

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } })
    const signIn = () => fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await act(() => {
      signIn()
    })

    expect(screen.getByText(/username is required/i)).toBeInTheDocument()
  })

  it('requires a password', async () => {
    const history = createMemoryHistory()

    render(
      <Router location={history.location} navigator={history}>
        <SignIn />
      </Router>
    )

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: '' },
    })

    const signIn = () => fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await act(() => {
      signIn()
    })

    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it('allows user to log in', async () => {
    const history = createMemoryHistory()

    mockedLoginUser.mockImplementation(function* ({ payload }) {
      yield put(
        loginSuccess({ username: payload.username, email: 'e@e.co', fullName: 'full name' })
      )
    })

    render(
      <Router location={history.location} navigator={history}>
        <SignIn />
      </Router>,
      { saga: getSaga([takeLatest(login.type, mockedLoginUser)]) }
    )

    const signIn = () => fireEvent.click(screen.getByRole('button', { name: /log in/i }))
    const username = 'username1'
    const password = 'password1'

    fireEvent.change(screen.getByRole('textbox'), { target: { value: username } })
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: password },
    })

    await act(() => {
      signIn()
    })

    expect(mockedLoginUser).toBeCalledTimes(1)
    expect(mockedLoginUser).toBeCalledWith({
      payload: { password, username },
      type: 'auth/login',
    })

    // redirect
    expect(screen.queryByRole('button', { name: /log in/i })).toBeNull()
  })

  it('notifies the user when there is an error', async () => {
    const history = createMemoryHistory()
    const errorMessage = 'Something went wrong'

    mockedLoginUser.mockImplementation(function* () {
      yield put(loginError(errorMessage))
    })

    render(
      <Router location={history.location} navigator={history}>
        <SignIn />
      </Router>,
      { saga: getSaga([takeLatest(login.type, mockedLoginUser)]) }
    )

    const signIn = () => fireEvent.click(screen.getByRole('button', { name: /log in/i }))
    const username = 'username1'
    const password = 'password1'

    fireEvent.change(screen.getByRole('textbox'), { target: { value: username } })
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: password },
    })

    await act(() => {
      signIn()
    })

    expect(mockedLoginUser).toBeCalledTimes(1)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })
})
