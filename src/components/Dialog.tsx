import { blackA } from '@radix-ui/colors'
import * as DialogPrimitive from '@radix-ui/react-dialog'

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
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  '&:focus': { outline: 'none' },
  transition: 'width 0.3s ease-out',
})

const StyledClose = styled(DialogPrimitive.Close, {
  border: 'none',
  backgroundColor: 'transparent',
  zIndex: 1,
  cursor: 'pointer',
})

const StyledTitle = styled(DialogPrimitive.Title, {
  fontWeight: 600,
  fontSize: '1rem',
  textAlign: 'center',
})

const StyledDescription = styled(DialogPrimitive.Description, {
  margin: '10px 0 20px',
  fontSize: 15,
  lineHeight: 1.5,
})

export const Portal = ({ children }: { children: any }) => (
  <DialogPrimitive.Portal>
    <StyledOverlay />
    {children}
  </DialogPrimitive.Portal>
)

export const Root = DialogPrimitive.Root
export const Trigger = DialogPrimitive.Trigger
export const Close = StyledClose
export const Content = StyledContent
export const Overlay = StyledOverlay
export const Title = StyledTitle
export const Description = StyledDescription
