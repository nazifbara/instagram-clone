import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { ViewRoute, LoginFormState } from '../types'
import { getAuth } from '../selectors'
import { login } from '../slices/auth'
import { TextInput, Text, Logo, Button, Link } from '../components'
import { styled } from '../stitches.config'

const SignInView = (): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { error, loading, isAuthenticated } = useSelector(getAuth)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const initialState: LoginFormState = {
    username: '',
    password: '',
  }

  if (isAuthenticated) {
    return <Navigate to="/app" />
  }

  return (
    <Wrapper>
      <Logo big />
      <Formik
        initialValues={initialState}
        validate={(values) => {
          const errors: { username?: string; password?: string } = {}

          if (!values.username) {
            errors.username = 'Username is required'
          } else if (!values.password) {
            errors.password = 'Password is required'
          }
          return errors
        }}
        onSubmit={async (values) => dispatch(login(values))}
      >
        {() => (
          <FormWrapper as={Form}>
            <ErrorMessage name="username" component={InputErrorMessage} />
            <TextInput as={Field} placeholder="Username" name="username" />
            <ErrorMessage name="password" component={InputErrorMessage} />
            <TextInput as={Field} placeholder="Password" type="password" name="password" />
            <InputErrorMessage>{error}</InputErrorMessage>
            <Button type="contained" fullWidth>
              {loading ? 'Loging in...' : 'Log in'}
            </Button>
          </FormWrapper>
        )}
      </Formik>

      <Text>
        Don't have an account?{' '}
        <Link color="primary" to="/auth/signup">
          Sign up
        </Link>
      </Text>
    </Wrapper>
  )
}

const FormWrapper = styled('div', { width: '70%', my: '2rem', '& > input': { mb: '10px' } })

const InputErrorMessage = styled('div', {
  color: '$dangerSolid',
  mb: '5px',
})
const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '21.875rem',
  margin: '50px auto',
  py: '50px',
  backgroundColor: '$accentBg',
  border: '1px solid $grayBorder',
})

export const signInRoute: ViewRoute = {
  name: 'SignInView',
  props: {
    path: '/auth/login',
    element: <SignInView />,
  },
}
