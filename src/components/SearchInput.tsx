import { ChangeEvent, useState } from 'react'
import { styled } from '@stitches/react'
import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons'

export const SearchInput = (): JSX.Element => {
  const [focused, setFocused] = useState(false)
  const [term, setTerm] = useState('')

  const handleTermChange = (e: ChangeEvent<HTMLInputElement>) => setTerm(e.target.value)
  const handleDismiss = () => setTerm('')
  const handleFocus = () => setFocused(true)
  const handleBlur = () => {
    setTimeout(() => {
      setFocused(false)
    }, 150)
  }

  return (
    <Wrapper>
      {!focused && (
        <SearchIcon>
          <MagnifyingGlassIcon width="20px" height="20px" />
        </SearchIcon>
      )}
      <InputField
        value={term}
        onChange={handleTermChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search"
      />
      {focused && (
        <CloseBtn onClick={handleDismiss}>
          <Cross1Icon color="black" />
        </CloseBtn>
      )}
    </Wrapper>
  )
}

const SearchIcon = styled('span', {
  position: 'absolute',
  left: '0.625rem',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'transparent',
})

const Wrapper = styled('div', {
  position: 'relative',
  backgroundColor: '$blue3',
  borderRadius: '0.25rem',
  width: '100%',
  maxWidth: '16.75rem',
})

const InputField = styled('input', {
  color: '$blue12',
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
  backgroundColor: '$gray3',
  border: 'none',
  borderRadius: '50%',
  height: '1rem',
  width: '1rem',
  padding: '0.125rem',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$gray4',
  },
})
