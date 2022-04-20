import { styled } from '../stitches.config'

export const TextInput = styled('input', {
  width: '100%',
  backgroundColor: '$accentBase',
  color: '$textBase',
  p: '9px 7px',
  border: '1px solid $grayBorder',
  borderRadius: '3px',
  '&:focus': {
    outline: '2px solid $accentFocus',
    border: 'none',
  },
})
