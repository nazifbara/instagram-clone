import { forwardRef, ForwardedRef } from 'react'
import { GetItemPropsOptions } from 'downshift'

import { styled } from '../../stitches.config'
import { User } from '../../types'
import { Text, Avatar } from '../'

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
        <Text bold>{item.username}</Text>
        <Text css={{ mt: '0.5rem' }} gray>
          {item.name}
        </Text>
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
  '&:hover': {
    backgroundColor: '$blue4',
  },
  variants: {
    highlighted: {
      true: {
        backgroundColor: '$blue4',
      },
    },
  },
})
