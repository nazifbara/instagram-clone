import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

import { IconButton, Dialog } from '../'

export const SearchButton = (): JSX.Element => {
  return (
    <Dialog.Root>
      <IconButton as={Dialog.Trigger} css={{ '@md': { display: 'none' } }}>
        <MagnifyingGlassIcon width="30px" height="30px" />
      </IconButton>
      <Dialog.Portal>
        <Dialog.Content css={{ transform: 'initial', height: '100%', width: '100%' }}>
          Hey
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
