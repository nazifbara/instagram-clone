import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

import { IconButton } from '../'

export const SearchButton = (): JSX.Element => {
  return (
    <IconButton css={{ '@md': { display: 'none' } }}>
      <MagnifyingGlassIcon width="30px" height="30px" />
    </IconButton>
  )
}
