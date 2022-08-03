import { Auth } from 'aws-amplify'

import { APILoginParam, User, APISignUpParam } from '../types'
import { getErrorMessage } from './helpers'

//==============================================================================
// Auth
//==============================================================================

export const signUp = async ({ username, password, email, fullName }: APISignUpParam) => {
  try {
    await Auth.signUp({
      username,
      password,
      attributes: {
        email,
        name: fullName,
      },
    })
  } catch (error: any) {
    console.error({ clientSignUpError: error })
    throw new Error(getErrorMessage(error))
  }
}

export const login = async ({ username, password }: APILoginParam) => {
  try {
    const user: User = await Auth.signIn({ username, password })
    return user
  } catch (error: any) {
    console.error({ clientLoginError: error })
    throw new Error(getErrorMessage(error))
  }
}

//==============================================================================
// Client export
//==============================================================================

export const Client = {
  login,
  signUp,
}
