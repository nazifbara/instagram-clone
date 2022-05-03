export const getErrorMessage = (error: any) => {
  switch (error.code) {
    case 'UsernameExistsException':
      return 'That username is taken. Try another.'

    case 'InvalidParameterException':
      if (error.message.includes('password')) {
        return 'Password must be at least 8 characters long.'
      } else {
        return 'Something went wrong...'
      }

    case 'UserNotFoundException':
    case 'NotAuthorizedException':
      return error.message

    case 'NetworkError':
      return 'Please check your internet connection and try again.'

    default:
      return 'Something went wrong...'
  }
}
