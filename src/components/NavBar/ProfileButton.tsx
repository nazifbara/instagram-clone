import { Link, Avatar, Popover, Text, Separator, Icons, IconButton } from '../'
import { Trigger as PopoverTrigger } from '../Popover'
import { currentUser } from '../../data'
import { styled } from '../../stitches.config'

export const ProfileButton = (): JSX.Element => {
  return (
    <Popover.Root>
      <IconButton as={PopoverTrigger}>
        <Avatar
          size="1.5rem"
          src={currentUser.avatar}
          alt={currentUser.name ?? ''}
          fallback={currentUser.username[0].toUpperCase()}
        />
      </IconButton>
      <Popover.Content sideOffset={6}>
        <Popover.Arrow />
        <MenuItem to={`/app/${currentUser.username}`} text>
          <Icons.Pofile />
          <Text css={{ ml: '0.75rem' }}>Profile</Text>
        </MenuItem>
        <MenuItem text to="/app/account/edit">
          <Icons.Settings />
          <Text css={{ ml: '0.75rem' }}>Settings</Text>
        </MenuItem>
        <Separator />
        <MenuItem text as="span">
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
