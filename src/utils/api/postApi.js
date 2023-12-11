import axios from "axios";
import { BASE_URL } from "../constants";

export function fetchFeed(page = 1, limit = 8) {
  return axios.get(
    `${BASE_URL}/api/posts/fetch-feed?page=${page}&limit=${limit}`
  );
}

export function fetchExplore(page = 1, limit = 8) {
  return axios.get(
    `${BASE_URL}/api/posts/fetch-explore?page=${page}&limit=${limit}`
  );
}

export function togglePostLike(postId) {
  return axios.patch(`${BASE_URL}/api/posts/like/${postId}`);
}

export function deletePost(postId) {
  return axios.delete(`${BASE_URL}/api/posts/post/${postId}`);
}
