import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "./types";

type CommentSliceState = {
  commentData: null | Comment;
};

const initialState: CommentSliceState = {
  commentData: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setStateComment(state, action) {
      state.commentData = action.payload;
    },
  },
});

export const { setStateComment } = commentSlice.actions;
export default commentSlice.reducer;
