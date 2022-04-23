import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Auth } from 'aws-amplify'
import { useNavigate } from 'react-router-dom'

import { ViewRoute } from '../types'
import { TextInput, Text, Logo, Button, Link } from '../components'
import { styled } from '../stitches.config'

type FormState = {
  email: string
  fullName: string
  username: string
  password: string
  globaleError: string
}

const SignUp = (): JSX.Element => {
  const initialState: FormState = {
    email: '',
    fullName: '',
    username: '',
    password: '',
    globaleError: '',
  }
  const navigate = useNavigate()

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
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            await signUp(values)
          } catch (error: any) {
            console.error({ signUpError: error })
            switch (error.code) {
              case 'UsernameExistsException':
                setFieldError('globaleError', 'That username is taken. Try another.')
                break

              case 'InvalidParameterException':
                if (error.message.includes('password')) {
                  setFieldError('globaleError', 'Password must be at least 8 characters long.')
                } else {
                  setFieldError('globaleError', 'Something went wrong...')
                }
                break

              default:
                setFieldError('globaleError', 'Something went wrong...')
                break
            }
            return
          }
          setSubmitting(false)
          navigate('/auth/login')
        }}
      >
        {({ isSubmitting }) => (
          <FormWrapper as={Form}>
            <InputErrorMessage name="email" component="div" />
            <TextInput as={Field} placeholder="Email" type="email" name="email" />
            <InputErrorMessage name="fullName" component="div" />
            <TextInput as={Field} placeholder="Full Name" name="fullName" />
            <InputErrorMessage name="username" component="div" />
            <TextInput as={Field} placeholder="Username" name="username" />
            <InputErrorMessage name="password" component="div" />
            <TextInput as={Field} placeholder="Password" type="password" name="password" />
            <InputErrorMessage name="globaleError" component="div" />
            <Button type="contained" fullWidth>
              {isSubmitting ? 'Submitting...' : 'Sign up'}
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

const signUp = async ({ username, password, email, fullName }: FormState) => {
  const { user } = await Auth.signUp({
    username,
    password,
    attributes: {
      email,
      name: fullName,
    },
  })
  console.info({ userSignedUp: user })
}

const FormWrapper = styled('div', { width: '70%', mb: '2rem', '& > input': { mb: '10px' } })

const InputErrorMessage = styled(ErrorMessage, {
  color: '$dangerSolid',
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

export const signUpRoute: ViewRoute = {
  name: 'SignUpView',
  props: {
    path: '/auth/signup',
    element: <SignUp />,
  },
}
