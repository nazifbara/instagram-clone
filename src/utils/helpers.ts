import { DataStore } from 'aws-amplify'

import { Media as MediaModel } from '../models'
import { CreateMediaInput } from '../types'

export const getAvatarURL = (username: string = 'random') =>
  `https://avatars.dicebear.com/api/avataaars/${username}.svg`

export const updateLikesMap = (
  likesMapStr: string | null | undefined,
  prevLikeCount: number | null | undefined,
  username: string
): { likesMap: string; likeCount: number } => {
  const likesMap: { [anyProps: string]: boolean } = likesMapStr ? JSON.parse(likesMapStr) : {}
  let likeCount = 0

  if (likesMap[username] && prevLikeCount) {
    delete likesMap[username]
    likeCount = prevLikeCount - 1
  } else {
    likesMap[username] = true
    likeCount = prevLikeCount ? prevLikeCount + 1 : 1
  }

  return { likeCount, likesMap: JSON.stringify(likesMap) }
}

export const createMedia = async ({ postID, mediaKey }: CreateMediaInput) => {
  return await DataStore.save(new MediaModel({ postID, mediaKey }))
}

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
