import { styled } from '../stitches.config'

export const Button = styled('button', {
  backgroundColor: '$blue9',
  color: '$blue12',
  p: '5px 9px',
  borderRadius: '4px',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  '&:active': {
    backgroundColor: '$blue10',
  },
})
