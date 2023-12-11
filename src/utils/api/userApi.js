import axios from "axios";
import { BASE_URL } from "../constants";

export function followUser({ followId, type }) {
  return axios.post(`${BASE_URL}/api/users/follow`, { followId, type });
}

export function getSuggestUsers(size) {
  return axios.get(`${BASE_URL}/api/users/suggest/${size}`);
}

export function getProfile(id) {
  return axios.get(`${BASE_URL}/api/users/profile/${id}`);
}

export function getUsersByIds(ids) {
  return axios.post(`${BASE_URL}/api/users/ids/`, {
    ids,
  });
}

export function updateUser({ name, bio, image }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio);
  formData.append("image", image);

  return axios.patch(`${BASE_URL}/api/users/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function deleteUser(id) {
  return axios.delete(`${BASE_URL}/api/users/user/${id}`);
}
