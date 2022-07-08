import { DataStore, Storage } from 'aws-amplify'
import { v4 as uuid } from 'uuid'

import { Media as MediaModel } from '../models'
import { PostToMediaMap, Post, CreateMediaInput } from '../types'

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

      if (medias[0]) {
        const url = await getSignedMediaUrl(medias[0].mediaKey)

        postToMediaMap[p.id] = url || ''
      }
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
