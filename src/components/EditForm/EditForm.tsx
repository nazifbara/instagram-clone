import { ChangeEventHandler } from 'react'
import { Formik, Form, Field } from 'formik'
import { useSelector, useDispatch } from 'react-redux'

import { styled } from '../../stitches.config'
import { TextInput, TextArea, Text, Button, Box, Avatar, FileInput } from '..'
import { getAuth, getProfile } from '../../selectors'
import { updateProfilePhoto, updateInfo } from '../../slices/profile'
import { ProfileUpdates } from '../../types'

export const EditForm = (): JSX.Element => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { currentUser } = useSelector(getAuth)
  const { currentProfile, updatingPhoto, updatingInfo, error } = useSelector(getProfile)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _updateInfo = (username: string, updates: ProfileUpdates) =>
    dispatch(updateInfo({ username, updates }))
  const _updateProfilePhoto = (photo: File, username: string) =>
    dispatch(updateProfilePhoto({ photo, username }))

  // ===========================================================================
  // Handlers
  // ===========================================================================

  const handlePhotoSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && currentUser?.username) {
      _updateProfilePhoto(e.target.files[0], currentUser.username)
    }
  }

  return (
    <>
      {currentProfile ? (
        <Formik
          initialValues={{
            fullName: currentProfile.fullName,
            bio: currentProfile.bio,
            website: currentProfile.website,
          }}
          onSubmit={async (values) => {
            _updateInfo(currentProfile.username, values)
          }}
        >
          {() => (
            <Wrapper>
              <Box
                as={Form}
                css={{
                  width: '100%',
                  px: '1rem',
                  '@sm': {
                    px: '4rem',
                  },
                }}
              >
                <Text
                  as="h1"
                  bold
                  css={{
                    fontSize: '$4',
                    mb: '1rem',
                    textAlign: 'center',
                    '@sm': { mb: '2.5rem', fontSize: '$5' },
                  }}
                >
                  Edit profile
                </Text>
                <FormField
                  avatar={
                    <Avatar
                      isLoading={updatingPhoto}
                      loadingMessage="..."
                      src={currentProfile?.photoLink || ''}
                      alt="user profile image"
                    />
                  }
                  input={
                    <Box
                      css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                    >
                      <Text css={{ mb: '0.5rem', fontSize: '$4 !important' }} bold>
                        {currentProfile.username}
                      </Text>
                      <Button
                        as="label"
                        htmlFor="photo-input"
                        css={{ p: '0', fontSize: '$2 !important' }}
                      >
                        Change profile photo
                        <FileInput
                          id="photo-input"
                          type="file"
                          accept=".png,.jpeg"
                          data-testid="photo-input"
                          onChange={handlePhotoSelect}
                        />
                      </Button>
                    </Box>
                  }
                />

                <FormField
                  label="Name"
                  labelFor="fullName"
                  input={<TextInput as={Field} placeholder="Name" id="fullName" name="fullName" />}
                />

                <FormField
                  label="Website"
                  labelFor="website"
                  input={<TextInput as={Field} placeholder="Website" id="website" name="website" />}
                />

                <FormField
                  label="Bio"
                  labelFor="bio"
                  input={<Field as={TextArea} rows="6" placeholder="Bio" id="bio" name="bio" />}
                />

                <FormField
                  input={
                    <Button type="contained">{updatingInfo ? 'Submitting..' : 'Submit'}</Button>
                  }
                />

                <FormField input={<span>{error}</span>} />
              </Box>
            </Wrapper>
          )}
        </Formik>
      ) : (
        'loading...'
      )}
    </>
  )
}

const FormField = ({
  label,
  labelFor,
  input,
  avatar,
}: {
  label?: string
  labelFor?: string
  input: any
  avatar?: any
}): JSX.Element => {
  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        mb: '0.5rem',
        '& *': { fontSize: '$3' },
        '@sm': { flexDirection: 'row', mb: '1rem', alignItems: avatar ? 'center' : 'flex-start' },
      }}
    >
      <Box
        as="label"
        htmlFor={labelFor}
        css={{
          fontWeight: '700',
          flex: 1,
          px: '0',
          pt: avatar ? '0' : '0.5rem',
          mb: avatar || label ? '0.5rem' : '0',

          '@sm': {
            px: '1.75rem',
            textAlign: 'right',
            mb: '0',
          },
        }}
      >
        {label}
        {avatar}
      </Box>
      <Box css={{ flex: 5 }}>{input}</Box>
    </Box>
  )
}

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '43.75rem',
  margin: '0 auto',
  py: '1rem',
  backgroundColor: '$accentBg',
  border: '1px solid $grayBorder',

  '@sm': {
    py: '3.125rem',
  },
})
