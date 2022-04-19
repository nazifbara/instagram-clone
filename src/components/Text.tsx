import { styled } from '../stitches.config'

export const Text = styled('span', {
  color: '$textBase',
  lineHeight: '1.125rem',
  variants: {
    gray: {
      true: {
        color: '$textGray',
      },
    },
    bold: {
      true: {
        fontWeight: '600',
      },
    },
  },
})
