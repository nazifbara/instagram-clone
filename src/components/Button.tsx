import { styled } from '../stitches.config'

export const Button = styled('button', {
  backgroundColor: 'transparent',
  color: '$blue9',
  p: '5px 9px',
  borderRadius: '4px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  variants: {
    type: {
      contained: {
        backgroundColor: '$blue9',
        color: '$blue12',
        '&:active': {
          backgroundColor: '$blue10',
        },
      },
      simple: {
        border: '1px solid $gray6',
        color: 'inherit',
      },
    },
  },
})
