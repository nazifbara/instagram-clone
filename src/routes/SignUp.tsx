import { ViewRoute } from '../types'
import { Text, Logo, Button } from '../components'
import { styled } from '../stitches.config'

const SignUp = (): JSX.Element => {
  return (
    <Wrapper>
      <Logo big />
      <Text gray bold css={{ fontSize: '$3', textAlign: 'center', m: '10px 40px' }}>
        Sign up to see photos from your friends.
      </Text>
      <Form>
        <TextInput placeholder="Email" />
        <TextInput placeholder="Full Name" />
        <TextInput placeholder="Username" />
        <TextInput placeholder="Password" type="password" />
        <Button type="contained" fullWidth>
          Sign up
        </Button>
      </Form>
    </Wrapper>
  )
}

const TextInput = styled('input', {
  width: '100%',
  backgroundColor: '$accentBase',
  p: '9px 7px',
  border: '1px solid $grayBorder',
  borderRadius: '3px',
})

const Form = styled('form', { width: '70%', '& > input': { mb: '10px' } })

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
