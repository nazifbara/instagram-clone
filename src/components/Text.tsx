import { styled } from '../stitches.config'

export const Text = styled('div', {
  display: 'block',
  color: '$blue12',
  variants: {
    gray: {
      true: {
        color: '$gray12',
      },
    },
    bold: {
      true: {
        fontWeight: '600',
      },
    },
  },
})
