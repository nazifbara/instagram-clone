import { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { signUp, signUpReset } from '../../slices/auth'
import { getAuth } from '../../selectors'
import { SignUpFormState } from '../../types'
import { TextInput, Text, Logo, Button, Link } from '../../components'
import { styled } from '../../stitches.config'

export const SignUp = (): JSX.Element => {
  // ===========================================================================
  // State
  // ===========================================================================

  const initialState: SignUpFormState = {
    email: '',
    fullName: '',
    username: '',
    password: '',
  }

  // ===========================================================================
  // Hook
  // ===========================================================================

  useEffect(() => () => {
    _signUpReset()
  })

  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { error, loading, signUpSuccess, isAuthenticated } = useSelector(getAuth)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _signUp = (data: SignUpFormState) => dispatch(signUp(data))
  const _signUpReset = () => dispatch(signUpReset())

  if (isAuthenticated) {
    return <Navigate to="/app" />
  }

  if (signUpSuccess) {
    return <Navigate to="/auth/login" />
  }

  return (
    <Wrapper>
      <Logo big />
      <Text gray bold css={{ fontSize: '$3', textAlign: 'center', m: '10px 40px' }}>
        Sign up to see photos from your friends.
      </Text>
      <Formik
        initialValues={initialState}
        validate={(values) => {
          const errors: any = {}

          if (!values.email) {
            errors.email = 'Email is required'
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid email address'
          } else if (!values.fullName) {
            errors.fullName = 'Full name is required'
          } else if (!values.username) {
            errors.username = 'Username is required'
          } else if (!values.password) {
            errors.password = 'Password is required'
          }
          return errors
        }}
        onSubmit={async (values) => _signUp(values)}
      >
        {() => (
          <FormWrapper as={Form}>
            <ErrorMessage name="email" component={InputErrorMessage} />
            <TextInput as={Field} placeholder="Email" type="email" name="email" />
            <ErrorMessage name="fullName" component={InputErrorMessage} />
            <TextInput as={Field} placeholder="Full Name" name="fullName" />
            <ErrorMessage name="username" component={InputErrorMessage} />
            <TextInput as={Field} placeholder="Username" name="username" />
            <ErrorMessage name="password" component={InputErrorMessage} />
            <TextInput as={Field} placeholder="Password" type="password" name="password" />
            <InputErrorMessage>{error}</InputErrorMessage>
            <Button type="contained" fullWidth>
              {loading ? 'Submitting...' : 'Sign up'}
            </Button>
          </FormWrapper>
        )}
      </Formik>

      <Text>
        Have an account?{' '}
        <Link color="primary" to="/auth/login">
          Log in
        </Link>
      </Text>
    </Wrapper>
  )
}

const FormWrapper = styled('div', { width: '70%', mb: '2rem', '& > input': { mb: '10px' } })

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
