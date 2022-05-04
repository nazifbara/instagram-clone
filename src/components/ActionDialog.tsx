import * as DialogPrimitive from '@radix-ui/react-dialog'
import { blackA } from '@radix-ui/colors'

import { styled, overlayShow, contentShow } from '../stitches.config'

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: blackA.blackA9,
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: '$accentBg',
  borderRadius: 12,
  position: 'fixed',
  minWidth: '25rem',
  overflowY: 'hidden',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  '&:focus': { outline: 'none' },
  transition: 'width 0.3s ease-out',
})

const StyledOption = styled('button', {
  display: 'block',
  fontSize: '$2',
  color: '$textBase',
  border: 'none',
  borderBottom: '1px solid $grayBorder',
  backgroundColor: 'transparent',
  p: '0.5rem',
  width: '100%',
  cursor: 'pointer',
  minHeight: '3rem',
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
    },
  },
})

export const Content = ({ children }: { children?: JSX.Element }): JSX.Element => {
  return (
    <DialogPrimitive.DialogPortal>
      <StyledOverlay />
      <StyledContent>
        {children}
        <StyledOption as={DialogPrimitive.Close}>Cancel</StyledOption>
      </StyledContent>
    </DialogPrimitive.DialogPortal>
  )
}

export const Root = DialogPrimitive.Root
export const Trigger = DialogPrimitive.Trigger
export const Option = StyledOption
