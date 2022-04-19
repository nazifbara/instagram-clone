import { blackA } from '@radix-ui/colors'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { CSSProperties } from '@stitches/react'
import { MouseEventHandler } from 'react'

import { Icons, IconButton } from '.'
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
  position: 'fixed',
  zIndex: 1,
  cursor: 'pointer',
  top: '1.875rem',
  right: '-6%',
})

type ContentProps = {
  children: any
  css?: CSSProperties
  navigation?: boolean
  currentIndex?: number
  lastIndex?: number
  onBackClick?: MouseEventHandler<HTMLButtonElement>
  onNextClick?: MouseEventHandler<HTMLButtonElement>
}
export const Content = ({
  children,
  css,
  navigation = false,
  currentIndex,
  lastIndex,
  onBackClick,
  onNextClick,
}: ContentProps) => (
  <DialogPrimitive.Portal>
    <StyledOverlay />
    <StyledContent css={{ ...css }}>
      <StyledClose>
        <Icons.Close />
      </StyledClose>
      {navigation && lastIndex !== undefined && currentIndex !== undefined && (
        <>
          {lastIndex - currentIndex !== lastIndex && (
            <PostNavButton onClick={onBackClick} side="left" offset="-5%" />
          )}
          {lastIndex - currentIndex !== 0 && (
            <PostNavButton onClick={onNextClick} side="right" offset="-5%" />
          )}
        </>
      )}
      {children}
    </StyledContent>
  </DialogPrimitive.Portal>
)

type PostNavButtonProps = {
  side: 'left' | 'right'
  offset?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}
const PostNavButton = ({ side, offset = '2rem', onClick }: PostNavButtonProps) => (
  <IconButton
    onClick={onClick}
    css={{
      position: 'fixed',
      display: 'flex',
      wh: '2.5rem',
      justifyContent: 'center',
      alignItems: 'center',
      left: side === 'left' ? offset : 'initial',
      right: side === 'right' ? offset : 'initial',
      top: '50%',
      borderRadius: '50%',
      backgroundColor: '$accentBg',
      transform: `rotate(${side === 'left' ? '-90deg' : '90deg'}) translateY(-50%)`,
      '&:hover': {
        backgroundColor: '$accentBgHover',
      },
    }}
  >
    <Icons.Chevron />
  </IconButton>
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
