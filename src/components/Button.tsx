import { styled } from '../stitches.config'

export const Button = styled('button', {
  backgroundColor: 'transparent',
  color: '$primaryText',
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
        backgroundColor: '$primarySolid',
        color: '$primaryTextContrast',
        '&:active': {
          backgroundColor: '$primarySolidHover',
        },
      },
      simple: {
        border: '1px solid $accentBorder',
        color: '$accentText',
      },
    },
  },
})
