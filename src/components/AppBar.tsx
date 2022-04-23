import { useLocation } from 'react-router-dom'

import { Link, Container, Logo, SearchInput, NavBar } from '.'

import { styled } from '../stitches.config'

const Header = styled('header', {
  backgroundColor: '$accentBg',
  borderBottom: '1px solid $grayBorder',
  position: 'fixed',
  width: '100%',
})

export const AppBar = (): JSX.Element => {
  const location = useLocation()
  const isHidden = ['/accounts/login', '/accounts/emailsignup'].includes(location.pathname)

  return (
    <>
      {!isHidden && (
        <Header>
          <Container
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '3.75rem',
            }}
          >
            <Link to="/">
              <Logo />
            </Link>
            <SearchInput />
            <NavBar />
          </Container>
        </Header>
      )}
    </>
  )
}
