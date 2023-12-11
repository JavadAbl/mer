import axios from "axios";
import { BASE_URL } from "../constants";

export function addComment({ postId, content }) {
  return axios.post(
    `${BASE_URL}/api/comments/`,
    { postId, content },
    {
      headers: {
        contentType: "application/json",
      },
    }
  );
}
