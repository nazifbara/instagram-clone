import * as DialogPrimitive from '@radix-ui/react-dialog'

import { styled } from '../stitches.config'
import { Dialog } from '.'

const StyledOption = styled(DialogPrimitive.Close, {
  display: 'block',
  fontSize: '$2',
  color: '$textBase',
  border: 'none',
  borderBottom: '1px solid $grayBorder',
  backgroundColor: 'transparent',
  p: '1rem',
  width: '100%',
  cursor: 'pointer',
  textAlign: 'center',

  '&:active': {
    backgroundColor: '$accentBgSubtle',
  },

  '&:last-child': {
    borderBottom: 'none',
  },

  variants: {
    kind: {
      danger: {
        fontWeight: 700,
        color: '$dangerSolid',
      },
      primary: {
        fontWeight: 700,
        color: '$accentText',
      },
    },
  },
})

export const Content = ({ children }: { children?: JSX.Element }): JSX.Element => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content
        css={{
          width: '95%',
          maxWidth: '25rem',
        }}
      >
        {children}
        <StyledOption as={DialogPrimitive.Close}>Cancel</StyledOption>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export const Root = DialogPrimitive.Root
export const Trigger = DialogPrimitive.Trigger
export const Option = StyledOption
