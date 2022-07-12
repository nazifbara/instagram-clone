import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

import {
  ResultItem,
  CloseIcon,
  SearchIcon,
  SearchInputIconWrapper,
  SearchInputCloseBtn,
  SearchInputField,
  SearchInputWrapper,
} from '../SearchInput/SearchInput'
import { IconButton, Dialog, Box, Icons, Text } from '../'
import { useSearch } from '../../utils/hooks'

export const SearchButton = (): JSX.Element => {
  // ===========================================================================
  // Hooks
  // ===========================================================================

  const {
    searchResult,
    hasResult,
    error,
    focused,
    showSearchStatus,
    isLoading,
    getMenuProps,
    getItemProps,
    getComboboxProps,
    highlightedIndex,
    getInputProps,
    inputValue,
    handleFocus,
    handleBlur,
    handleDismiss,
  } = useSearch()

  return (
    <Box css={{ '@md': { display: 'none' } }}>
      <Dialog.Root>
        <IconButton as={Dialog.Trigger}>
          <MagnifyingGlassIcon width="30px" height="30px" />
        </IconButton>
        <Dialog.Portal>
          <Dialog.Content
            css={{ transform: 'initial', height: '100%', width: '100%', borderRadius: 0 }}
            {...getComboboxProps()}
          >
            <Box css={{ display: 'flex' }}>
              <SearchInputWrapper fullWidth>
                {!focused && (
                  <SearchInputIconWrapper>
                    <SearchIcon width="20px" height="20px" />
                  </SearchInputIconWrapper>
                )}
                <SearchInputField
                  {...getInputProps()}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Search"
                />
                {inputValue && (
                  <SearchInputCloseBtn onClick={handleDismiss}>
                    <CloseIcon />
                  </SearchInputCloseBtn>
                )}
              </SearchInputWrapper>
              <Dialog.Close css={{ pl: '1rem' }}>
                <Icons.Close />
              </Dialog.Close>
            </Box>

            {showSearchStatus && (
              <Box css={{ p: '1rem' }}>
                {isLoading && <Text gray>searching...</Text>}

                {error && (
                  <Text gray css={{ color: '$dangerSolid' }}>
                    {error}
                  </Text>
                )}

                {!hasResult && !isLoading && !error && <Text gray>No results found.</Text>}
              </Box>
            )}

            <ul {...getMenuProps()}>
              {hasResult &&
                searchResult &&
                searchResult.map((item, index) => (
                  <ResultItem
                    key={`${item.username}-search-item}`}
                    highlighted={highlightedIndex === index}
                    item={item}
                    itemProps={getItemProps({ item, index })}
                  />
                ))}
            </ul>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Box>
  )
}
