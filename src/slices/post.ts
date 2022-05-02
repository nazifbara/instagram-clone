import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { PostState, NewPost, Post } from '../types'

const initialState: PostState = {
  posts: [],
  isFetchingPosts: false,
  isCreatingPost: false,
  postCreationSuccess: false,
  error: '',
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<NewPost>) => {
      state.isCreatingPost = true
    },

    addPostSuccess: (state, { payload }: PayloadAction<Post>) => {
      console.log({ addPostSuccess: payload })
      state.isCreatingPost = false
      state.postCreationSuccess = true
      state.posts.unshift(payload)
    },

    addPostError: (state, { payload }: PayloadAction<string>) => {
      state.isCreatingPost = false
      state.postCreationSuccess = false
      state.error = payload
    },

    addPostReset: (state) => {
      state.postCreationSuccess = false
      state.error = ''
    },
  },
})

export const { addPost, addPostSuccess, addPostError, addPostReset } = postSlice.actions

export const postReducer = postSlice.reducer
