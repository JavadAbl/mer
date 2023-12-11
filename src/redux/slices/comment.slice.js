import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ comment, token }, thunk) => {
    try {
      await axios.post(`${BASE_URL}/api/comments`, comment, {
        headers: {
          contentType: "application/json",
        },
      });
      thunk.dispatch(getPostComments({ postId: comment.postId, token }));
      return {};
    } catch (error) {
      thunk.rejectWithValue(error);
      console.log(error);
    }
  }
);

//----------------------------------------------------
export const getPostComments = createAsyncThunk(
  "comments/getPostComments",
  async ({ postId, token }, thunk) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/comments/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data.comments;
    } catch (error) {
      thunk.rejectWithValue(error);
      console.log(error);
    }
  }
);

//----------------------------------------------------
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ commentId, token, postId }, thunk) => {
    try {
      await axios.delete(`${BASE_URL}/api/comments/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      thunk.dispatch(getPostComments({ postId, token }));
      return {};
    } catch (error) {
      thunk.rejectWithValue(error);
      console.log(error);
    }
  }
);

//----------------------------------------------------
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ token, commentId, postId, content }, thunk) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/comments`,
        { commentId, content },
        {
          headers: {
            contentType: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      thunk.dispatch(getPostComments({ postId, token }));
      return {};
    } catch (error) {
      thunk.rejectWithValue(error);
      console.log(error);
    }
  }
);

//----------------------------------------------------
const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    loading: false,
    comments: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createComment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createComment.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createComment.rejected, (state, action) => {
      state.error = action.payload || action.error;
      state.loading = false;
    });
    //----------------------------------------------------
    builder.addCase(getPostComments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPostComments.fulfilled, (state, action) => {
      state.comments = action.payload;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(getPostComments.rejected, (state, action) => {
      state.error = action.payload || action.error;
      state.loading = false;
    });
  },
});

export const { shouldLoad } = commentsSlice.actions;

export default commentsSlice.reducer;
