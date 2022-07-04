import { Link, useMatch } from 'react-router-dom'

import { styled } from '../../stitches.config'
import { Icons } from '../'
import { SearchButton } from '../'
import { ProfileButton } from '../ProfileButton'
import { CreateButton } from '../CreateButton'

export const NavBar = (): JSX.Element => {
  const homeMatch = useMatch('/')

  return (
    <StyledNav>
      <ul>
        <li>
          <SearchButton />
        </li>
        <li>
          <Link to={'/'}>
            <Icons.Home fill={Boolean(homeMatch)} />
          </Link>
        </li>
        <li>
          <CreateButton />
        </li>
        <li>
          <ProfileButton />
        </li>
      </ul>
    </StyledNav>
  )
}

const StyledNav = styled('nav', {
  position: 'fixed',
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: '$accentBg',
  borderTop: '1px solid $grayBorder',

  '@md': {
    position: 'initial',
    borderTop: 'none',
    marginRight: '1.375rem',
  },

  '& ul': {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    py: '0.375rem',

    '@md': {
      py: '0',
    },
  },
  '& li': {
    cursor: 'pointer',
  },
  '& li:not(:last-child)': {
    '@md': {
      marginRight: '1.375rem',
    },
  },
})
