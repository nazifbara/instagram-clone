import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Auth } from 'aws-amplify'
import { useNavigate } from 'react-router-dom'

import { ViewRoute } from '../types'
import { TextInput, Text, Logo, Button, Link } from '../components'
import { styled } from '../stitches.config'

type FormState = {
  username: string
  password: string
  globaleError: string
}

const SignInView = (): JSX.Element => {
  const initialState: FormState = {
    username: '',
    password: '',
    globaleError: '',
  }
  const navigate = useNavigate()

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
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            await signIn(values)
          } catch (error: any) {
            console.error({ signUpError: error })
            switch (error.code) {
              case 'UserNotFoundException':
              case 'NotAuthorizedException':
                setFieldError('globaleError', error.message)
                break
              case 'NetworkError':
                setFieldError(
                  'globaleError',
                  'Please check your internet connection and try again.'
                )
                break
              default:
                setFieldError('globaleError', 'Something went wrong...')
                break
            }
            setSubmitting(false)
            return
          }
          navigate('/')
        }}
      >
        {({ isSubmitting }) => (
          <FormWrapper as={Form}>
            <InputErrorMessage name="username" component="div" />
            <TextInput as={Field} placeholder="Username" name="username" />
            <InputErrorMessage name="password" component="div" />
            <TextInput as={Field} placeholder="Password" type="password" name="password" />
            <InputErrorMessage name="globaleError" component="div" />
            <Button type="contained" fullWidth>
              {isSubmitting ? 'Loging in...' : 'Log in'}
            </Button>
          </FormWrapper>
        )}
      </Formik>

      <Text>
        Don't have an account?{' '}
        <Link color="primary" to="/accounts/emailsignup">
          Sign up
        </Link>
      </Text>
    </Wrapper>
  )
}

const signIn = async ({ username, password }: FormState) => {
  const user = await Auth.signIn({ username, password })
  console.info({ signedInUser: user })
}

const FormWrapper = styled('div', { width: '70%', my: '2rem', '& > input': { mb: '10px' } })

const InputErrorMessage = styled(ErrorMessage, {
  color: '$dangerSolid',
  mb: '5px',
})
const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '21.875rem',
  margin: '0 auto',
  py: '50px',
  backgroundColor: '$accentBg',
  border: '1px solid $grayBorder',
})

export const signInRoute: ViewRoute = {
  name: 'SignInView',
  props: {
    path: '/accounts/login',
    element: <SignInView />,
  },
}
