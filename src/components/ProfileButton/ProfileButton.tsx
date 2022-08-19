import { useSelector, useDispatch } from 'react-redux'

import { logout } from '../../slices/auth'
import { getAuth, getProfile } from '../../selectors'
import { Link, Avatar, Popover, Text, Separator, Icons, IconButton } from '..'
import { Trigger as PopoverTrigger } from '../Popover'
import { styled } from '../../stitches.config'

export const ProfileButton = (): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { currentUser } = useSelector(getAuth)
  const { currentProfile, updatingPhoto } = useSelector(getProfile)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _logout = () => dispatch(logout())

  // ===========================================================================
  // Hanlders
  // ===========================================================================

  const handleLogout = () => _logout()

  if (!currentProfile) {
    return <>...</>
  }
  return (
    <Popover.Root>
      <IconButton as={PopoverTrigger}>
        <Avatar
          size="1.5rem"
          isLoading={updatingPhoto}
          loadingMessage="."
          src={currentProfile.photoLink ?? ''}
          alt={currentProfile.fullName ?? ''}
          fallback={currentProfile.username[0]}
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
