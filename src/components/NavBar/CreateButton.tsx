import { ChangeEventHandler, useState } from 'react'

import { Dialog, Icons, Separator, Box, Button, Text, IconButton } from '../'
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
      <StyledButton>
        <Icons.Create />
      </StyledButton>
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
            <Box>username</Box>
          </Box>
        )}
      </Dialog.Content>
    </Dialog.Root>
  )
}

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

const StyledButton = styled(Dialog.Trigger, {
  borderRadius: '100%',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
})
