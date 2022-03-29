import { ChangeEventHandler, useState } from 'react'

import { Dialog, Icons, Separator, Box, Button, Text, IconButton, Avatar } from '../'
import { currentUser } from '../../data'
import { styled } from '../../stitches.config'

type NewPost = {
  caption: string
  media: File | null
}

export const CreateButton = (): JSX.Element => {
  const [newPost, setNewPost] = useState<NewPost>({ caption: '', media: null })
  const [captionStep, setCaptionStep] = useState(false)

  const handleMediaSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewPost((s) => {
      if (e.target.files) {
        return { ...s, media: e.target.files[0] }
      }
      return s
    })

    setCaptionStep(true)
  }

  const handleBackClick = () => setCaptionStep(false)

  return (
    <Dialog.Root onOpenChange={(o) => o && handleBackClick()}>
      <IconButton as={Dialog.Trigger}>
        <Icons.Create />
      </IconButton>
      <Dialog.Content css={{ width: captionStep ? '57.5625rem' : '36.3125rem', height: '39rem' }}>
        <StyledTopBar>
          {captionStep && (
            <IconButton onClick={handleBackClick}>
              <Icons.Back />
            </IconButton>
          )}
          <Dialog.Title css={{ flexGrow: 1 }}>Create new post</Dialog.Title>
          {captionStep && <Button>Share</Button>}
        </StyledTopBar>
        <Separator />
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
              onChange={handleMediaSelect}
            />
            <Text css={{ fontSize: '1.375rem', fontWeight: 300 }}>Choose a photo</Text>
            <Button as="label" type="contained" htmlFor="media-input">
              Select from computer
            </Button>
          </Box>
        )}
        {captionStep && newPost.media && (
          <Box
            css={{
              height: '100%',
              display: 'flex',
            }}
          >
            <Box
              css={{
                backgroundImage: `url("${URL.createObjectURL(newPost.media)}")`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: 'calc(100% - 2.625rem)',
                width: '62%',
              }}
            />
            <Separator orientation="vertical" />
            <Box css={{ flexGrow: 1 }}>
              <Box css={{ display: 'flex', alignItems: 'center', mx: '1rem', height: '3.75rem' }}>
                <Avatar
                  src={currentUser.avatar}
                  fallback="p"
                  alt={currentUser.username}
                  size="1.75rem"
                  css={{ marginRight: '0.75rem' }}
                />
                <Text bold>{currentUser.username}</Text>
              </Box>
              <StyledCaptionInput placeholder="Write a caption..." />
              <Separator orientation="horizontal" />
            </Box>
          </Box>
        )}
      </Dialog.Content>
    </Dialog.Root>
  )
}

const StyledCaptionInput = styled('textarea', {
  width: '100%',
  height: 'calc(50% - 2.625rem)',
  px: '1rem',
  backgroundColor: 'transparent',
  border: 'none',
  resize: 'none',
  color: '$blue12',
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
