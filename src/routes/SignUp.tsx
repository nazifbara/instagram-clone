import { Formik, Form, Field } from 'formik'
import { Auth } from 'aws-amplify'
import { useNavigate } from 'react-router-dom'

import { ViewRoute } from '../types'
import { TextInput, Text, Logo, Button } from '../components'
import { styled } from '../stitches.config'

type FormState = {
  email: string
  fullName: string
  username: string
  password: string
}

const SignUp = (): JSX.Element => {
  const initialState: FormState = { email: '', fullName: '', username: '', password: '' }
  const navigate = useNavigate()

  return (
    <Wrapper>
      <Logo big />
      <Text gray bold css={{ fontSize: '$3', textAlign: 'center', m: '10px 40px' }}>
        Sign up to see photos from your friends.
      </Text>
      <Formik
        initialValues={initialState}
        onSubmit={async (values, { setSubmitting }) => {
          await signUp(values)
          setSubmitting(false)
          navigate('/accounts/login')
        }}
      >
        {({ isSubmitting }) => (
          <FormWrapper as={Form}>
            <TextInput as={Field} placeholder="Email" type="email" name="email" />
            <TextInput as={Field} placeholder="Full Name" name="fullName" />
            <TextInput as={Field} placeholder="Username" name="username" />
            <TextInput as={Field} placeholder="Password" type="password" name="password" />
            <Button type="contained" fullWidth>
              {isSubmitting ? 'Submitting...' : 'Sign up'}
            </Button>
          </FormWrapper>
        )}
      </Formik>
    </Wrapper>
  )
}

const signUp = async ({ username, password, email, fullName }: FormState) => {
  try {
    const { user } = await Auth.signUp({
      username,
      password,
      attributes: {
        email,
        name: fullName,
      },
    })
    console.log({ userSignedUp: user })
  } catch (error) {
    console.error({ signUpError: error })
  }
}

const FormWrapper = styled('div', { width: '70%', '& > input': { mb: '10px' } })

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

export const signUpRoute: ViewRoute = {
  name: 'SignUpView',
  props: {
    path: '/accounts/emailsignup',
    element: <SignUp />,
  },
}
