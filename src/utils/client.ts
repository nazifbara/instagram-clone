import { Auth } from 'aws-amplify'

import { APILoginParam, User } from '../types'
import { getErrorMessage } from './helpers'

//==============================================================================
// Auth
//==============================================================================

export const login = async ({ username, password }: APILoginParam) => {
  try {
    const user: User = await Auth.signIn({ username, password })
    return user
  } catch (error: any) {
    console.error({ apiLoginError: error })
    throw new Error(getErrorMessage(error))
  }
}

//==============================================================================
// Client export
//==============================================================================

export const client = {
  login,
}
