import { useSelector, useDispatch } from 'react-redux'

import { getAvatarURL } from '../../utils/helpers'
import { logout } from '../../slices/auth'
import { getAuth } from '../../selectors'
import { Link, Avatar, Popover, Text, Separator, Icons, IconButton } from '..'
import { Trigger as PopoverTrigger } from '../Popover'
import { styled } from '../../stitches.config'

export const ProfileButton = (): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { currentUser } = useSelector(getAuth)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _logout = () => dispatch(logout())

  // ===========================================================================
  // Hanlders
  // ===========================================================================

  const handleLogout = () => _logout()

  return (
    <Popover.Root>
      <IconButton as={PopoverTrigger}>
        <Avatar
          size="1.5rem"
          src={getAvatarURL(currentUser?.username)}
          alt={currentUser?.fullName ?? ''}
          fallback={currentUser?.username[0].toUpperCase() ?? 'U'}
        />
      </IconButton>
      <Popover.Content sideOffset={6}>
        <Popover.Arrow />
        <MenuItem to={`/app/${currentUser?.username}`} text>
          <Icons.Pofile />
          <Text css={{ ml: '0.75rem' }}>Profile</Text>
        </MenuItem>
        <MenuItem text to={`/app/${currentUser?.username}`}>
          <Icons.Settings />
          <Text css={{ ml: '0.75rem' }}>Settings</Text>
        </MenuItem>
        <Separator />
        <MenuItem onClick={handleLogout} text as="span">
          <Text>Logout</Text>
        </MenuItem>
      </Popover.Content>
    </Popover.Root>
  )
}

const MenuItem = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  p: '0.5rem 1rem',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$accentBgHover',
  },
  variants: {
    highlighted: {
      true: {
        backgroundColor: '$accentBgHover',
      },
    },
  },
})
