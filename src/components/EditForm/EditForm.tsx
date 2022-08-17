import { useCallback, useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useSelector, useDispatch } from 'react-redux'

import { styled } from '../../stitches.config'
import { Client } from '../../utils/client'
import { TextInput, TextArea, Text, Button, Box, Avatar } from '..'
import { getAuth, getUser } from '../../selectors'
import { getUserDetail } from '../../slices/user'

export const EditForm = (): JSX.Element => {
  // ===========================================================================
  // State
  // ===========================================================================

  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')

  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { currentUser } = useSelector(getAuth)
  const { userDetail } = useSelector(getUser)

  console.log(userDetail)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  const _getUserDetail = useCallback(
    (username: string) => dispatch(getUserDetail(username)),
    [dispatch]
  )

  // ===========================================================================
  // Hooks
  // ===========================================================================

  useEffect(() => {
    if (currentUser?.username) {
      _getUserDetail(currentUser.username)
    }
  }, [_getUserDetail, currentUser])

  return (
    <>
      {userDetail.data ? (
        <Formik
          initialValues={{
            fullName: userDetail.data.fullName,
            bio: userDetail.data.bio,
            website: userDetail.data.website,
          }}
          onSubmit={async (values) => {
            setIsUpdating(true)
            setError('')

            if (userDetail.data) {
              try {
                await Client.updateProfile(userDetail.data.username, values)
              } catch (error: any) {
                setError(error.message)
              }
            }

            setIsUpdating(false)
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
                    <Avatar src={userDetail.data?.photoLink || ''} alt="user profile image" />
                  }
                  input={
                    <Box
                      css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                    >
                      <Text css={{ mb: '0.5rem', fontSize: '$4 !important' }} bold>
                        {userDetail.data?.username}
                      </Text>
                      <Button css={{ p: '0', fontSize: '$2 !important' }}>
                        Change profile photo
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
                  input={<Button type="contained">{isUpdating ? 'Submitting..' : 'Submit'}</Button>}
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
