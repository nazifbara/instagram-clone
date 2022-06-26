import React, {
  ChangeEvent,
  ChangeEventHandler,
  memo,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { NewPost } from '../../types'
import { addPost, addPostReset } from '../../slices/post'
import { getAuth, getPost } from '../../selectors'
import { Dialog, Icons, Separator, Box, Button, Text, IconButton, Avatar } from '..'

import { styled } from '../../stitches.config'
import { getAvatarURL } from '../../utils/helpers'

export const CreateButton = (): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { currentUser } = useSelector(getAuth)
  const { isPosting, postCreationSuccess, error } = useSelector(getPost)

  // ===========================================================================
  // State
  // ===========================================================================

  const [caption, setCaption] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [media, setMedia] = useState<File | null>(null)
  const [captionStep, setCaptionStep] = useState(false)

  const showBackButton = captionStep && !isPosting
  const showShareButton = showBackButton
  const showCaption = captionStep && media && !isPosting

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()
  const _createNewPost = useCallback((newPost: NewPost) => dispatch(addPost(newPost)), [dispatch])
  const _addPostReset = useCallback(() => dispatch(addPostReset()), [dispatch])

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const openDialog = () => setIsOpen(true)

  const closeDialog = () => setIsOpen(false)

  const handleMediaSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    setMedia((s) => {
      if (e.target.files) {
        return e.target.files[0]
      }
      return s
    })

    setCaptionStep(true)
  }

  const handleBackClick = useCallback(() => {
    setCaptionStep(false)
    setMedia(null)
    setCaption('')
    _addPostReset()
  }, [_addPostReset])

  const handleCaptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => setCaption(e.target.value)

  const handleShare = () => {
    if (!media) {
      return
    }
    _createNewPost({ postInput: { caption }, medias: [media], owner: currentUser?.username })
  }

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    if (postCreationSuccess) {
      closeDialog()
      handleBackClick()
      _addPostReset()
    }
  }, [postCreationSuccess, error, _createNewPost, _addPostReset, handleBackClick])

  return (
    <>
      <IconButton onClick={openDialog}>
        <Icons.Create />
      </IconButton>

      <Dialog.Root
        open={isOpen}
        onOpenChange={(o) => {
          handleBackClick()
          setIsOpen(o)
        }}
      >
        <Dialog.Content css={{ width: captionStep ? '57.5625rem' : '36.3125rem', height: '39rem' }}>
          <StyledTopBar>
            {showBackButton && (
              <IconButton onClick={handleBackClick}>
                <Icons.Back />
              </IconButton>
            )}
            <Dialog.Title css={{ flexGrow: 1 }}>Create new post</Dialog.Title>

            {showShareButton && <Button onClick={handleShare}>Share</Button>}
          </StyledTopBar>
          <Separator />

          {isPosting && (
            <Text as="div" css={{ textAlign: 'center', mt: '50px' }}>
              loading...
            </Text>
          )}

          {!captionStep && (
            <Box
              css={{
                p: '1.25rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                '& > :not(last-child)': {
                  mb: '1.51rem',
                },
              }}
            >
              <Icons.Media />
              <StyledFileInput
                id="media-input"
                type="file"
                accept=".png,.jpeg"
                data-testid="media-input"
                onChange={handleMediaSelect}
              />
              <Text css={{ fontSize: '1.375rem', fontWeight: 300 }}>Choose a photo</Text>
              <Button as="label" type="contained" htmlFor="media-input">
                Select from computer
              </Button>
            </Box>
          )}

          {showCaption && (
            <Box
              css={{
                height: '100%',
                display: 'flex',
              }}
            >
              <MediaBox media={media} />
              <Separator orientation="vertical" />
              <Box css={{ flexGrow: 1 }}>
                <Box css={{ display: 'flex', alignItems: 'center', mx: '1rem', height: '3.75rem' }}>
                  <Avatar
                    src={getAvatarURL(currentUser?.username)}
                    fallback="p"
                    alt={currentUser?.username}
                    size="1.75rem"
                    css={{ marginRight: '0.75rem' }}
                  />
                  <Text bold>{currentUser?.username}</Text>
                </Box>

                {error && (
                  <Text as="div" css={{ color: '$dangerSolid', px: '1rem' }}>
                    {error}
                  </Text>
                )}

                <StyledCaptionInput
                  placeholder="Write a caption..."
                  onChange={handleCaptionChange}
                  value={caption}
                />
                <Separator orientation="horizontal" />
              </Box>
            </Box>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

const MediaBox: React.FC<{ media: File }> = memo(({ media }) => (
  <Box
    css={{
      backgroundImage: `url("${URL.createObjectURL(media)}")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: 'calc(100% - 2.625rem)',
      width: '62%',
    }}
  />
))
const StyledCaptionInput = styled('textarea', {
  width: '100%',
  height: 'calc(50% - 2.625rem)',
  px: '1rem',
  backgroundColor: 'transparent',
  border: 'none',
  resize: 'none',
  color: '$accentTextContrast',
  fontSize: '1rem',
  overflowY: 'scroll',
  '&:focus': {
    outline: 'none',
  },
})

const StyledTopBar = styled('div', {
  display: 'flex',
  px: '1.25rem',
  height: '2.625rem',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
})

const StyledFileInput = styled('input', {
  width: '0.1px',
  height: '0.1px',
  opacity: 0,
  overflow: 'hidden',
  position: 'absolute',
  zIndex: -1,
})
