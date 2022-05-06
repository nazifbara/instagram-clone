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
    deletePost: (state, { payload: postID }: PayloadAction<string>) => {
      const index = state.posts.findIndex((p) => p.id === postID)
      state.posts = [...state.posts.slice(0, index), ...state.posts.slice(index + 1)]
    },

    loadPosts: (state) => {
      state.isLoading = true
    },

    loadPostsSuccess: (
      state,
      { payload }: PayloadAction<{ posts: Post[]; postToMediaMap: PostToMediaMap }>
    ) => {
      state.isLoading = false
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
      { payload }: PayloadAction<{ post: Post; postToMediaMap: PostToMediaMap }>
    ) => {
      console.log({ addPostSuccess: payload })
      state.isPosting = false
      state.postCreationSuccess = true
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
