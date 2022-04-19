import { styled } from '../stitches.config'

export const Button = styled('button', {
  backgroundColor: 'transparent',
  color: '$textPrimary',
  p: '5px 9px',
  borderRadius: '4px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  variants: {
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    type: {
      contained: {
        backgroundColor: '$accentSolid',
        color: '$textBase',
        '&:active': {
          backgroundColor: '$accentSolidHover',
        },
      },
      simple: {
        border: '1px solid $grayBorder',
        color: 'inherit',
      },
    },
  },
})
