import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { updateLikesMap } from '../utils/helpers'
import { PostState, NewPost, Post, PostToMediaMap } from '../types'

const initialState: PostState = {
  posts: [],
  view: null,
  profileUsername: null,
  postToMediaMap: {},
  isLoading: false,
  isPosting: false,
  postCreationSuccess: false,
  error: '',
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    toggleLike: (
      state,
      { payload: { username, postID } }: PayloadAction<{ postID: string; username: string }>
    ) => {
      const post = state.posts.find((p) => p.id === postID)
      if (!post) {
        return
      }

      const updates = updateLikesMap(post.likesMap, post.likeCount, username)

      post.likeCount = updates.likeCount
      post.likesMap = updates.likesMap
    },

    getUserPosts: (state, action: PayloadAction<string>) => {
      state.isLoading = true
    },

    getUserPostsSuccess: (
      state,
      {
        payload,
      }: PayloadAction<{ username: string; posts: Post[]; postToMediaMap: PostToMediaMap }>
    ) => {
      state.posts = payload.posts
      state.view = 'profile'
      state.profileUsername = payload.username
      state.isLoading = false
      state.error = ''
      state.postToMediaMap = { ...state.postToMediaMap, ...payload.postToMediaMap }
    },

    getUserPostsError: (state, { payload }: PayloadAction<string>) => {
      state.posts = []
      state.isLoading = false
      state.error = payload
    },

    deletePost: (state, { payload: postID }: PayloadAction<string>) => {
      const indexFeed = state.posts.findIndex((p) => p.id === postID)

      state.posts.splice(indexFeed, 1)
    },

    loadPosts: (state) => {
      state.isLoading = true
    },

    loadPostsSuccess: (
      state,
      { payload }: PayloadAction<{ posts: Post[]; postToMediaMap: PostToMediaMap }>
    ) => {
      state.isLoading = false
      state.view = 'feed'
      state.profileUsername = null
      state.posts = payload.posts
      state.postToMediaMap = { ...state.postToMediaMap, ...payload.postToMediaMap }
    },

    loadPostsError: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = false
      state.error = payload
    },

    addPost: (state, action: PayloadAction<NewPost>) => {
      state.isPosting = true
    },

    addPostSuccess: (
      state,
      { payload }: PayloadAction<{ username: string; post: Post; postToMediaMap: PostToMediaMap }>
    ) => {
      state.isPosting = false
      state.postCreationSuccess = true

      if (state.view === 'profile' && payload.username !== state.profileUsername) {
        return
      }

      state.posts.unshift(payload.post)
      state.postToMediaMap = { ...state.postToMediaMap, ...payload.postToMediaMap }
    },

    addPostError: (state, { payload }: PayloadAction<string>) => {
      state.isPosting = false
      state.postCreationSuccess = false
      state.error = payload
    },

    addPostReset: (state) => {
      state.postCreationSuccess = false
      state.error = ''
    },
  },
})

export const {
  toggleLike,
  getUserPosts,
  getUserPostsError,
  getUserPostsSuccess,
  deletePost,
  loadPosts,
  loadPostsSuccess,
  loadPostsError,
  addPost,
  addPostSuccess,
  addPostError,
  addPostReset,
} = postSlice.actions

export const postReducer = postSlice.reducer
