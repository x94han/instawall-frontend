import { api } from "boot/axios";

const USER_URL = "users";
export const apiLogin = (data) => api.post(`${USER_URL}/login`, data);
export const apiSignup = (data) => api.post(`${USER_URL}/signup`, data);

const POST_URL = "posts";
export const apiGetPosts = (data) => api.get(`${POST_URL}`, data);
export const apiGetPost = (id, data) => api.get(`${POST_URL}/${id}`, data);
export const apiAddComment = (id, data) =>
  api.post(`${POST_URL}/${id}/comment`, data);
