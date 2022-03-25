import { Dialog, Icons, Separator, Box, Button, Text } from '../'
import { styled } from '../../stitches.config'

export const CreateButton = (): JSX.Element => {
  return (
    <Dialog.Root>
      <StyledButton>
        <Icons.Create />
      </StyledButton>
      <Dialog.Content>
        <StyledTopBar>
          <Dialog.Title>Create new post</Dialog.Title>
        </StyledTopBar>
        <Separator />
        <Box
          css={{
            p: '1.50rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            '& > :not(last-child)': {
              mb: '1.51rem',
            },
          }}
        >
          <Icons.Media />
          <StyledFileInput id="media-input" type="file" />
          <Text css={{ fontSize: '1.375rem', fontWeight: 300 }}>Choose an photo</Text>
          <Button as="label" htmlFor="media-input">
            Select from computer
          </Button>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const StyledTopBar = styled('div', {
  display: 'flex',
  my: '0.875rem',
  justifyContent: 'center',
  width: '100%',
})

const StyledFileInput = styled('input', {
  width: '0.1px',
  height: '0.1px',
  opacity: 0,
  overflow: 'hidden',
  position: 'absolute',
  zIndex: -1,
})

const StyledButton = styled(Dialog.Trigger, {
  borderRadius: '100%',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
})
