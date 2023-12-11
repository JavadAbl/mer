import { configureStore } from "@reduxjs/toolkit";
import userReduser from "../slices/user.slice";
import commentReduser from "../slices/comment.slice";

const store = configureStore({
  reducer: {
    users: userReduser,
    comments: commentReduser,
  },
});

export default store;
