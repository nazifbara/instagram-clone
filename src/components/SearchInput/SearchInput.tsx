import { useState, useRef } from 'react'
import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useCombobox } from 'downshift'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { Text, Box } from '../'
import { getUser } from '../../selectors'
import { searchUser } from '../../slices/user'
import { Popover } from '../'
import { ResultItem } from './ResultItem'
import { styled } from '../../stitches.config'

export const SearchInput = (): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const {
    searchResult: { data: result, isLoading, error },
  } = useSelector(getUser)

  // ===========================================================================
  // State
  // ===========================================================================

  const [focused, setFocused] = useState(false)
  const noResult = result.length === 0 && !isLoading
  const hasResult = !noResult && !isLoading && !error
  const showSearchStatus = isLoading || error || noResult

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _searchUser = (username: string) => dispatch(searchUser(username))

  // ===========================================================================
  // Hooks
  // ===========================================================================

  const timer = useRef<any | null>(null)

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    inputValue,
    setInputValue,
  } = useCombobox({
    items: result,
    onInputValueChange: ({ inputValue }) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
      timer.current = setTimeout(() => {
        if (inputValue) {
          _searchUser(inputValue)
        }
      }, 300)
    },
    onSelectedItemChange: (changes) => {
      if (changes.selectedItem) {
        setInputValue(changes.selectedItem.Username)
        navigate(`/app/${changes.selectedItem.Username}`)
      }
    },
  })
  const navigate = useNavigate()

  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)
  const handleDismiss = () => setInputValue('')
  const preventDefault = (e: Event) => e.preventDefault()

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

              {noResult && <Text gray>No results found.</Text>}
            </Box>
          )}
          {hasResult && (
            <ul>
              {result.map((item, index) => (
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
