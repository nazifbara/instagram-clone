import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { PostState, NewPost, Post, PostToMediaMap } from '../types'

const initialState: PostState = {
  posts: [],
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
    loadPosts: (state) => {
      state.isLoading = true
    },

    loadPostsSuccess: (
      state,
      { payload }: PayloadAction<{ posts: Post[]; postToMediaMap: PostToMediaMap }>
    ) => {
      state.isLoading = false
      state.posts = payload.posts
      state.postToMediaMap = payload.postToMediaMap
      console.log({ loadPostsSuccess: payload })
    },

    loadPostsError: (state, { payload }: PayloadAction<string>) => {
      state.isLoading = false
      state.error = payload
    },

    addPost: (state, action: PayloadAction<NewPost>) => {
      state.isPosting = true
    },

    addPostSuccess: (state, { payload }: PayloadAction<Post>) => {
      console.log({ addPostSuccess: payload })
      state.isPosting = false
      state.postCreationSuccess = true
      state.posts.unshift(payload)
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
  loadPosts,
  loadPostsSuccess,
  loadPostsError,
  addPost,
  addPostSuccess,
  addPostError,
  addPostReset,
} = postSlice.actions

export const postReducer = postSlice.reducer
