import { Link as LinkRR } from 'react-router-dom'

import { styled } from '../stitches.config'

export const Link = styled(LinkRR, {
  textDecoration: 'none',
  fontWeight: 600,
  color: '$accentTextContrast',
  variants: {
    color: {
      primary: {
        color: '$primaryText',
      },
    },
    text: {
      true: {
        fontWeight: 'initial',
      },
    },
  },
})
