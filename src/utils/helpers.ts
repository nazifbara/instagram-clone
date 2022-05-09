import { DataStore, Storage } from 'aws-amplify'
import { v4 as uuid } from 'uuid'

import { Media as MediaModel } from '../models'
import { PostToMediaMap, Post } from '../types'
import { CreateMediaInput } from '../API'

export const createMedia = async ({ postID, mediaKey }: CreateMediaInput) => {
  return await DataStore.save(new MediaModel({ postID, mediaKey }))
}

export const uploadMedia = async (media: File): Promise<string> => {
  const mediaKey = uuid() + media.name.replace(/\s/g, '-').toLowerCase()
  await Storage.put(mediaKey, media)
  return mediaKey
}

export const getSignedMediaUrl = async (key: string | undefined) => {
  if (!key) {
    return
  }
  return await Storage.get(key)
}

export const mapPostsToMedias = async (posts: Post[]): Promise<PostToMediaMap> => {
  const postToMediaMap: PostToMediaMap = {}

  await Promise.all(
    posts.map(async (p) => {
      const medias: MediaModel[] = (await DataStore.query(MediaModel)).filter(
        (m) => m.postID === p.id
      )

      const url = await getSignedMediaUrl(medias[0].mediaKey)

      postToMediaMap[p.id] = url || ''
    })
  )
  return postToMediaMap
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
