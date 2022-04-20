import { Formik, Form, Field } from 'formik'
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

  return (
    <Wrapper>
      <Logo big />
      <Text gray bold css={{ fontSize: '$3', textAlign: 'center', m: '10px 40px' }}>
        Sign up to see photos from your friends.
      </Text>
      <Formik
        initialValues={initialState}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
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
