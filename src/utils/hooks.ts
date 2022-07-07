import { useState, useRef } from 'react'
import { useCombobox } from 'downshift'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { getUser } from '../selectors'
import { searchUser } from '../slices/user'

export const useSearch = () => {
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
  const hasResult = Boolean(result)
  const showSearchStatus = isLoading || error || !hasResult

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
    items: result ?? [],
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

  return {
    searchResult: result,
    isLoading,
    hasResult,
    error,
    focused,
    showSearchStatus,
    isOpen,
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
  }
}
