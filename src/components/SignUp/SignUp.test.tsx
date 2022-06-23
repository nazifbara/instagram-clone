import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { all, put, takeLatest } from 'redux-saga/effects'

import { render, screen, fireEvent, act } from '../../utils/test'
import { signUp, signUpSuccess, signUpError } from '../../slices/auth'
import { signUpUser } from '../../sagas'
import { SignUp } from './SignUp'

jest.mock('../../sagas')
const getSaga = (effects: unknown[]) =>
  function* () {
    yield all(effects)
  }
const mockedSignUpUser = jest.mocked(signUpUser, true)

describe('<SignUp />', () => {
  it('renders the sign up form', () => {
    const history = createMemoryHistory()

    render(
      <Router location={history.location} navigator={history}>
        <SignUp />
      </Router>
    )

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument()
  })

  it('requires inputs', async () => {
    const history = createMemoryHistory()

    render(
      <Router location={history.location} navigator={history}>
        <SignUp />
      </Router>
    )

    const submit = () => fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    // requires email
    await act(() => {
      submit()
    })
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()

    // requires full name
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'foo@bar.com' },
    })
    await act(() => {
      submit()
    })
    expect(screen.getByText(/full name is required/i)).toBeInTheDocument()

    // requires username
    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: 'foo bar' },
    })
    await act(() => {
      submit()
    })
    expect(screen.getByText(/username is required/i)).toBeInTheDocument()

    // requires password
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'foobar' },
    })
    await act(() => {
      submit()
    })
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it('allows user to sigup up', async () => {
    const history = createMemoryHistory()

    mockedSignUpUser.mockImplementation(function* (action) {
      yield put(signUpSuccess())
    })

    render(
      <Router location={history.location} navigator={history}>
        <SignUp />
      </Router>,
      { saga: getSaga([takeLatest(signUp.type, mockedSignUpUser)]) }
    )

    const data = {
      email: 'foo@bar.com',
      fullName: 'foo bar',
      username: 'foobar',
      password: 'foobarpass',
    }

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: data.email },
    })
    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: data.fullName },
    })
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: data.username },
    })
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: data.password },
    })

    const _signUp = () => fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await act(() => {
      _signUp()
    })

    expect(mockedSignUpUser).toBeCalledTimes(1)
    expect(mockedSignUpUser).toBeCalledWith({
      payload: data,
      type: 'auth/signUp',
    })
  })

  it('notifies the user when there is an error', async () => {
    const history = createMemoryHistory()
    const errorMessage = 'Something went wrong'

    mockedSignUpUser.mockImplementation(function* () {
      yield put(signUpError(errorMessage))
    })

    render(
      <Router location={history.location} navigator={history}>
        <SignUp />
      </Router>,
      { saga: getSaga([takeLatest(signUp.type, mockedSignUpUser)]) }
    )

    const _signUp = () => fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'foo@bar.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: 'foo bar' },
    })
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'foobar' },
    })
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'foobarpass' },
    })

    await act(() => {
      _signUp()
    })

    expect(mockedSignUpUser).toBeCalledTimes(1)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })
})
