import { useCallback, useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { useSelector, useDispatch } from 'react-redux'

import { Client } from '../../utils/client'
import { TextInput, Button } from '..'
import { getAuth, getUser } from '../../selectors'
import { getUserDetail } from '../../slices/user'

export const EditForm = (): JSX.Element => {
  // ===========================================================================
  // State
  // ===========================================================================

  const [isUpdating, setIsUpdating] = useState(false)

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
            if (userDetail.data) {
              await Client.updateProfile(userDetail.data.username, values)
            }
            setIsUpdating(false)
          }}
        >
          {() => (
            <Form>
              <TextInput as={Field} placeholder="Name" name="fullName" />
              <TextInput as={Field} placeholder="Website" name="website" />
              <TextInput as={Field} placeholder="Bio" name="bio" />
              <Button type="contained">{isUpdating ? 'Submitting..' : 'Submit'}</Button>
            </Form>
          )}
        </Formik>
      ) : (
        'loading...'
      )}
    </>
  )
}
