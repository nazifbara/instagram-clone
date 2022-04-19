import { forwardRef, ForwardedRef } from 'react'
import { GetItemPropsOptions } from 'downshift'

import { styled } from '../../stitches.config'
import { User } from '../../types'
import { Text, Avatar } from '../'
import { Box } from '../Box'

export const ResultItem = forwardRef(
  ({ item, itemProps, highlighted }: ResultItemProps, ref: ForwardedRef<HTMLLIElement>) => (
    <StyledResultItem highlighted={highlighted} {...itemProps} ref={ref}>
      <Avatar
        css={{ marginRight: '0.75rem' }}
        src={item.avatar}
        alt={item.name ?? ''}
        fallback={item.username[0].toUpperCase()}
      />
      <div>
        <Box>
          <Text bold>{item.username}</Text>
        </Box>
        <Box css={{ mt: '0.25rem' }}>
          <Text gray>{item.name}</Text>
        </Box>
      </div>
    </StyledResultItem>
  )
)

type ResultItemProps = {
  highlighted: boolean
  item: User
  itemProps: GetItemPropsOptions<HTMLLIElement>
}

const StyledResultItem = styled('li', {
  display: 'flex',
  alignItems: 'center',
  p: '0.5rem 1rem',
  cursor: 'pointer',
  lineHeight: 'initial',
  '&:hover': {
    backgroundColor: '$accentBgHover',
  },
  variants: {
    highlighted: {
      true: {
        backgroundColor: '$accentBgHover',
      },
    },
  },
})
