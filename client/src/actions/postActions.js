import axios from 'axios';

import {
  ADD_POST,
  GET_POSTS,
  GET_POST,
  POST_LOADING,
  DELETE_POST,
  LIKE_POST,
  DELETE_COMMENT,
  GET_ERRORS,
  CLEAR_ERRORS
} from './types';

// Get posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get('/api/posts/all')
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// Get post
export const getPost = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/posts/post/${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
};

// Add post
export const addPost = postData => dispatch => {
  dispatch(clearErrors());
  axios
    .post('/api/posts', postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/post/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add like
export const addLike = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(({ data }) =>
      dispatch({
        type: LIKE_POST,
        payload: data
      })
    )
    .catch(({ response }) =>
      dispatch({
        type: GET_ERRORS,
        payload: response.data
      })
    );
};

// Remove like
export const removeLike = id => dispatch => {
  axios
    .delete(`/api/posts/like/${id}`)
    .then(({ data }) =>
      dispatch({
        type: LIKE_POST,
        payload: data
      })
    )
    .catch(({ response }) =>
      dispatch({
        type: GET_ERRORS,
        payload: response.data
      })
    );
};

// Add comment
export const addComment = (postId, commentData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/posts/comment/${postId}`, commentData)
    .then(({ data }) =>
      dispatch({
        type: GET_POST,
        payload: data
      })
    )
    .catch(({ response }) =>
      dispatch({
        type: GET_ERRORS,
        payload: response.data
      })
    );
};

// Delete comment
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/posts/comment/${postId}/${commentId}`, postId, commentId)
    .then(res =>
      dispatch({
        type: DELETE_COMMENT,
        payload: commentId
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set loading state
export const setPostLoading = () => {
  return { type: POST_LOADING };
};

// Clear errors
export const clearErrors = () => {
  return { type: CLEAR_ERRORS };
};
