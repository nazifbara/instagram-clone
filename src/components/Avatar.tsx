import { styled } from '../stitches.config'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { Box } from '.'

type AvatarProps = {
  isLoading?: boolean
  loadingMessage?: any
  size?: string
  src: string
  alt: string
  fallback?: string
  css?: any
}
export const Avatar = ({
  isLoading = false,
  loadingMessage = 'loading...',
  size = '2.75rem',
  src,
  alt,
  fallback = 'U',
  css,
}: AvatarProps): JSX.Element => {
  return (
    <StyledAvatar css={{ wh: size, ...css }}>
      {isLoading && (
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          {loadingMessage}
        </Box>
      )}
      <StyledImage src={src} alt={alt} />
      <StyledFallback delayMs={600}>{fallback}</StyledFallback>
    </StyledAvatar>
  )
}

const StyledAvatar = styled(AvatarPrimitive.Root, {
  display: 'inline-flex',
  position: 'relative',
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
