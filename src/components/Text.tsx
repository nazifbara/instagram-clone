import { styled } from '../stitches.config'

export const Text = styled('span', {
  color: '$accentTextContrast',
  lineHeight: '1.125rem',
  wordWrap: 'break-word',
  variants: {
    gray: {
      true: {
        color: '$accentText',
      },
    },
    bold: {
      true: {
        fontWeight: '600',
      },
    },
  },
})
