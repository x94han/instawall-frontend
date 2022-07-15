import { api } from "boot/axios";

const USER_URL = "users";
export const apiLogin = (data) => api.post(`${USER_URL}/login`, data);
export const apiSignup = (data) => api.post(`${USER_URL}/signup`, data);
export const apiGetProfile = (id) => api.post(`${USER_URL}/${id}/profile`);

const POST_URL = "posts";
export const apiGetPosts = (params) => api.get(`${POST_URL}`, { params });
export const apiGetPost = (id, params) =>
  api.get(`${POST_URL}/${id}`, { params });
export const apiAddComment = (id, data) =>
  api.post(`${POST_URL}/${id}/comment`, data);
export const apiDeleteComment = (id) => api.delete(`${POST_URL}/comment/${id}`);
