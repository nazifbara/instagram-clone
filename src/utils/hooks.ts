import { useState, useRef, useEffect } from 'react'
import { useCombobox } from 'downshift'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { Client } from './client'
import { Profile } from '../models'
import { getSearchProfile } from '../selectors'
import { searchProfile } from '../slices/searchProfile'

export const useProfileByUsername = (username?: string) => {
  // ===========================================================================
  // State
  // ===========================================================================

  const [profile, setProfile] = useState<Profile | undefined>(undefined)

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    if (username) {
      Client.getProfileByUsername(username).then(setProfile)
    }
  }, [username])

  return profile
}

export const useSearch = () => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { data: result, isLoading, error } = useSelector(getSearchProfile)

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

  const _searchUser = (username: string) => dispatch(searchProfile(username))

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
        setInputValue(changes.selectedItem.username)
        navigate(`/app/${changes.selectedItem.username}`)
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
