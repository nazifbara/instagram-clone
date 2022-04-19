import { Link as LinkRR } from 'react-router-dom'

import { styled } from '../stitches.config'

export const Link = styled(LinkRR, {
  textDecoration: 'none',
  fontWeight: 600,
  color: '$textBase',
  variants: {
    color: {
      primary: {
        color: '$textPrimary',
      },
    },
    text: {
      true: {
        fontWeight: 'initial',
      },
    },
  },
})
