import { Link, Container, Logo, SearchInput, NavBar } from '.'

import { styled } from '../stitches.config'

const Header = styled('header', {
  backgroundColor: '$accentBg',
  borderBottom: '1px solid $grayBorder',
  position: 'fixed',
  zIndex: 1,
  width: '100%',
})

export const AppBar = (): JSX.Element => (
  <Header>
    <Container
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '3.125rem',

        '@md': {
          height: '3.75rem',
        },
      }}
    >
      <Link to="/">
        <Logo />
      </Link>
      <SearchInput />
      <NavBar />
    </Container>
  </Header>
)
