import { styled } from '../stitches.config'

export const Text = styled('span', {
  display: 'inline',
  color: '$blue12',
  lineHeight: '1.125rem',
  variants: {
    gray: {
      true: {
        color: '$gray11',
      },
    },
    bold: {
      true: {
        fontWeight: '600',
      },
    },
  },
})
