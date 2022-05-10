import { CSSProperties } from '@stitches/react'

import { styled } from '../stitches.config'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

type AvatarProps = {
  size?: string
  src: string
  alt: string
  fallback: string
  css?: CSSProperties
}
export const Avatar = ({
  size = '2.75rem',
  src,
  alt,
  fallback = 'U',
  css,
}: AvatarProps): JSX.Element => {
  return (
    <StyledAvatar css={{ ...css, wh: size }}>
      <StyledImage src={src} alt={alt} />
      <StyledFallback delayMs={600}>{fallback}</StyledFallback>
    </StyledAvatar>
  )
}

const StyledAvatar = styled(AvatarPrimitive.Root, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  width: 44,
  height: 44,
  borderRadius: '100%',
  backgroundColor: '$gray12',
})

const StyledImage = styled(AvatarPrimitive.Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
})

const StyledFallback = styled(AvatarPrimitive.Fallback, {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'accentTextContrast',
  color: '$accentText',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
})
