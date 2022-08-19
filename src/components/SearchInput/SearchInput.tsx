import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { forwardRef, ForwardedRef } from 'react'
import { GetItemPropsOptions } from 'downshift'

import { useSearch } from '../../utils/hooks'
import { Text, Box, Avatar } from '../'
import { Popover } from '../'
import { styled } from '../../stitches.config'
import { Profile } from '../../models'

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
    <Popover.Root open={isOpen && inputValue !== ''}>
      <SearchInputWrapper
        css={{ display: 'none', '@md': { display: 'initial' } }}
        as={Popover.Anchor}
        {...getComboboxProps()}
      >
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
        <Popover.Content
          {...getMenuProps()}
          css={{ width: '23.4375rem', height: '22.625rem', overflowY: 'scroll' }}
          onOpenAutoFocus={preventDefault}
          onCloseAutoFocus={preventDefault}
          sideOffset={6}
        >
          <Popover.Arrow />

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
                    key={`${item.username}-search-item}`}
                    highlighted={highlightedIndex === index}
                    item={item}
                    itemProps={getItemProps({ item, index })}
                  />
                ))}
            </ul>
          )}
        </Popover.Content>
      </SearchInputWrapper>
    </Popover.Root>
  )
}

export const CloseIcon = styled(Cross1Icon, { color: '$accentBase' })
export const SearchIcon = styled(MagnifyingGlassIcon, { color: '$grayPlaceholderText' })

export const SearchInputIconWrapper = styled('span', {
  position: 'absolute',
  left: '0.625rem',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'transparent',
})

export const SearchInputWrapper = styled('div', {
  position: 'relative',
  backgroundColor: '$accentBase',
  borderRadius: '0.25rem',
  width: '100%',
  maxWidth: '16.75rem',
  height: '2.25rem',
  border: 'none',

  variants: {
    fullWidth: {
      true: {
        maxWidth: 'initial',
      },
    },
  },
})

export const SearchInputField = styled('input', {
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

export const SearchInputCloseBtn = styled('button', {
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

export const ResultItem = forwardRef(
  ({ item, itemProps, highlighted }: ResultItemProps, ref: ForwardedRef<HTMLLIElement>) => (
    <StyledResultItem highlighted={highlighted} {...itemProps} ref={ref}>
      <Avatar
        css={{ marginRight: '0.75rem' }}
        src={item.photoLink || ''}
        alt={item.fullName ?? ''}
        fallback={item.username[0].toUpperCase()}
      />
      <div>
        <Box>
          <Text bold>{item.username}</Text>
        </Box>
        <Box css={{ mt: '0.25rem' }}>
          <Text gray>{item.fullName}</Text>
        </Box>
      </div>
    </StyledResultItem>
  )
)

type ResultItemProps = {
  highlighted: boolean
  item: Profile
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
