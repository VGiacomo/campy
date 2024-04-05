import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
import { Post } from "./types";

type PostSliceState = {
  postData: null | Post;
};

const initialState: PostSliceState = {
  postData: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost(state, action) {
      state.postData = action.payload;
    },
  },
});

export const { setPost } = postSlice.actions;
export default postSlice.reducer;
