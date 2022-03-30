import { styled } from '../stitches.config'

export const Container = styled('div', {
  maxWidth: '60.938rem',
  m: '0 auto',
  px: '20px',
  variants: {
    type: {
      feed: {
        maxWidth: '38.375rem',
        pt: '1.875rem',
        px: '0',
      },
    },
  },
})
