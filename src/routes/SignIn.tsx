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
          const errors: any = {}

          if (!values.username) {
            errors.email = 'Username is required'
          } else if (!values.password) {
            errors.password = 'Password is required'
          }
          return errors
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await signIn(values)
          } catch (error: any) {
            console.error({ signUpError: error })
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
