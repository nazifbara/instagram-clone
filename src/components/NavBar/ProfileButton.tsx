import { Avatar, Popover, Text, Separator, Icons } from '../'
import { Trigger as PopoverTrigger } from '../Popover'
import { currentUser } from '../../data'
import { styled } from '../../stitches.config'

export const ProfileButton = (): JSX.Element => {
  return (
    <Popover.Root>
      <StyledButton>
        <Avatar
          size="1.5rem"
          src={currentUser.avatar}
          alt={currentUser.name ?? ''}
          fallback={currentUser.username[0].toUpperCase()}
        />
      </StyledButton>
      <Popover.Content sideOffset={6}>
        <Popover.Arrow />
        <MenuItem>
          <Icons.Pofile />
          <Text>Profile</Text>
        </MenuItem>
        <MenuItem>
          <Icons.Settings />
          <Text>Settings</Text>
        </MenuItem>
        <Separator />
        <MenuItem>
          <Text css={{ ml: '0px !important' }}>Logout</Text>
        </MenuItem>
      </Popover.Content>
    </Popover.Root>
  )
}

const StyledButton = styled(PopoverTrigger, {
  borderRadius: '100%',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
})

const MenuItem = styled('a', {
  display: 'flex',
  alignItems: 'center',
  p: '0.5rem 1rem',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$blue4',
  },
  variants: {
    highlighted: {
      true: {
        backgroundColor: '$blue4',
      },
    },
  },
  [`& ${Text}`]: {
    ml: '0.75rem',
  },
})
