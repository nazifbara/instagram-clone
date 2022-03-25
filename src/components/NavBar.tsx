import { Link, useMatch } from 'react-router-dom'

import { styled } from '../stitches.config'
import { Icons, Avatar } from '.'
import { currentUser } from '../data'

export const NavBar = (): JSX.Element => {
  const homeMatch = useMatch('/')

  return (
    <StyledNav>
      <ul>
        <li>
          <Link to={'/'}>
            <Icons.Home fill={Boolean(homeMatch)} />
          </Link>
        </li>
        <li>
          <Icons.Create />
        </li>
        <li>
          <Avatar
            size="1.5rem"
            src={currentUser.avatar}
            alt={currentUser.name ?? ''}
            fallback={currentUser.username[0].toUpperCase()}
          />
        </li>
      </ul>
    </StyledNav>
  )
}

const StyledNav = styled('nav', {
  '& ul': {
    display: 'flex',
  },
  '& li': {
    cursor: 'pointer',
  },
  '& li:not(:last-child)': {
    marginRight: '1.375rem',
  },
})
