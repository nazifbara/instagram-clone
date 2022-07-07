import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons'

import { useSearch } from '../../utils/hooks'
import { Text, Box } from '../'
import { Popover } from '../'
import { ResultItem } from './ResultItem'
import { styled } from '../../stitches.config'

export const SearchInput = (): JSX.Element => {
  // ===========================================================================
  // Hooks
  // ===========================================================================

  const {
    searchResult,
    hasResult,
    error,
    focused,
    showSearchStatus,
    isOpen,
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
    preventDefault,
  } = useSearch()

  return (
    <Popover.Root open={true}>
      <Wrapper {...getComboboxProps()}>
        {!focused && (
          <SearchIconWrapper>
            <SearchIcon width="20px" height="20px" />
          </SearchIconWrapper>
        )}
        <InputField
          {...getInputProps()}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search"
        />
        {inputValue && (
          <CloseBtn onClick={handleDismiss}>
            <CloseIcon />
          </CloseBtn>
        )}
        <Popover.Content
          css={{ width: '375px', height: '362px', overflowY: 'scroll' }}
          onOpenAutoFocus={preventDefault}
          onCloseAutoFocus={preventDefault}
          onPointerDownOutside={preventDefault}
          onFocusOutside={preventDefault}
          onInteractOutside={preventDefault}
          sideOffset={6}
          hidden={!isOpen || inputValue === ''}
          {...getMenuProps()}
        >
          {showSearchStatus && (
            <Box
              css={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: '1rem',
                height: '100%',
              }}
            >
              {isLoading && <Text gray>searching...</Text>}

              {error && (
                <Text gray css={{ color: '$dangerSolid' }}>
                  {error}
                </Text>
              )}

              {!hasResult && !isLoading && !error && <Text gray>No results found.</Text>}
            </Box>
          )}
          {hasResult && (
            <ul>
              {searchResult &&
                searchResult.map((item, index) => (
                  <ResultItem
                    key={`${item.Attributes[0].Value}-search-item}`}
                    highlighted={highlightedIndex === index}
                    item={item}
                    itemProps={getItemProps({ item, index })}
                  />
                ))}
            </ul>
          )}
          <Popover.Arrow />
        </Popover.Content>
      </Wrapper>
    </Popover.Root>
  )
}

const CloseIcon = styled(Cross1Icon, { color: '$accentBase' })
const SearchIcon = styled(MagnifyingGlassIcon, { color: '$grayPlaceholderText' })

const SearchIconWrapper = styled('span', {
  position: 'absolute',
  left: '0.625rem',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'transparent',
})

const Wrapper = styled(Popover.Anchor, {
  display: 'none',

  '@md': {
    display: 'initial',
    position: 'relative',
    backgroundColor: '$accentBase',
    borderRadius: '0.25rem',
    width: '100%',
    maxWidth: '16.75rem',
    border: 'none',
  },
})

const InputField = styled('input', {
  color: '$accentTextContrast',
  backgroundColor: 'transparent',
  border: 'none',
  width: '100%',
  height: '2.25rem',
  fontSize: '1rem',
  padding: '0 0.625rem 0 2.5rem',
  '&:focus': {
    outline: 'none',
    padding: '0 0.625rem 0 0.625rem',
  },
})

const CloseBtn = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  position: 'absolute',
  right: '0.625rem',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: '$accentTextContrast',
  border: 'none',
  borderRadius: '50%',
  height: '1rem',
  width: '1rem',
  padding: '0.125rem',
  cursor: 'pointer',
})
