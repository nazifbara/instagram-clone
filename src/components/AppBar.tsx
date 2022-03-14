import { Container, Logo, SearchInput } from '.'

import { styled } from '../stitches.config'

const Header = styled('header', {
  backgroundColor: '$blue2',
})

export const AppBar = (): JSX.Element => {
  return (
    <Header>
      <Container
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '3.75rem',
        }}
      >
        <Logo />
        <SearchInput />
      </Container>
    </Header>
  )
}
