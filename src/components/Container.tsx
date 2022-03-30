import { styled } from '../stitches.config'

export const Container = styled('div', {
  maxWidth: '60.938rem',
  m: '0 auto',
  px: '1.25rem',
  variants: {
    type: {
      feed: {
        maxWidth: '38.375rem',
        px: '0',
      },
    },
  },
})
