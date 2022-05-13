import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { updateLikesMap } from '../utils/helpers'
import { PostState, NewPost, Post, PostToMediaMap } from '../types'

const initialState: PostState = {
  posts: [],
  postToMediaMap: {},
  userPosts: {
    data: [],
    isLoading: false,
    error: '',
  },
  isLoading: false,
  isPosting: false,
  postCreationSuccess: false,
  error: '',
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    toogleLike: (
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
      state.userPosts.isLoading = true
    },

    getUserPostsSuccess: (
      state,
      { payload }: PayloadAction<{ posts: Post[]; postToMediaMap: PostToMediaMap }>
    ) => {
      state.userPosts = {
        data: payload.posts,
        isLoading: false,
        error: '',
      }
      state.postToMediaMap = { ...state.postToMediaMap, ...payload.postToMediaMap }
    },

    getUserPostsError: (state, { payload }: PayloadAction<string>) => {
      state.userPosts = {
        data: [],
        isLoading: false,
        error: payload,
      }
    },

    deletePost: (state, { payload: postID }: PayloadAction<string>) => {
      const indexFeed = state.posts.findIndex((p) => p.id === postID)
      const indexProfile = state.userPosts.data.findIndex((p) => p.id === postID)
      console.log(indexProfile)

      state.posts.splice(indexFeed, 1)
      state.userPosts.data.splice(indexProfile, 1)
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
  toogleLike,
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
