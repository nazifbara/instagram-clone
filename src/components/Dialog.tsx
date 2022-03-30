import { blackA } from '@radix-ui/colors'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { CSSProperties } from '@stitches/react'

import { Icons } from '.'
import { styled, keyframes } from '../stitches.config'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -50%) scale(1.5)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: blackA.blackA9,
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: '$blue2',
  borderRadius: 12,
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflow: 'hidden',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  '&:focus': { outline: 'none' },
  transition: 'width 0.3s ease-out',
})

const StyledClose = styled(DialogPrimitive.Close, {
  border: 'none',
  backgroundColor: 'transparent',
  position: 'fixed',
  zIndex: 1,
  cursor: 'pointer',
  top: '1.875rem',
  right: '1.875rem',
})

type ContentProps = {
  children: any
  css?: CSSProperties
}

export const Content = ({ children, css }: ContentProps) => (
  <DialogPrimitive.Portal>
    <StyledClose>
      <Icons.Close />
    </StyledClose>
    <StyledOverlay />
    <StyledContent css={{ ...css }}>{children}</StyledContent>
  </DialogPrimitive.Portal>
)

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

export const Root = DialogPrimitive.Root
export const Trigger = DialogPrimitive.Trigger
export const Title = StyledTitle
export const Description = StyledDescription
