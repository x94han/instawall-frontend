import { api } from "boot/axios";

const USER_URL = "users";
export const apiLogin = (data) => api.post(`${USER_URL}/login`, data);
export const apiSignup = (data) => api.post(`${USER_URL}/signup`, data);
export const apiGetProfile = (id) => api.get(`${USER_URL}/${id}/profile`);
export const apiUpdateProfile = (id, data) =>
  api.patch(`${USER_URL}/${id}/profile`, data);
export const apiGetLikePosts = (id, params) =>
  api.get(`${USER_URL}/likes`, { params });
export const apiGetFans = (id) => api.get(`${USER_URL}/${id}/fans`);
export const apiGetFollowings = (id) => api.get(`${USER_URL}/${id}/followings`);
export const apiFollowUser = (id) => api.post(`${USER_URL}/${id}/follow`);
export const apiUnfollowUser = (id) => api.delete(`${USER_URL}/${id}/follow`);

const POST_URL = "posts";
export const apiGetPosts = (params) => api.get(`${POST_URL}`, { params });
export const apiGetPost = (id) => api.get(`${POST_URL}/${id}`);
export const apiAddComment = (id, data) =>
  api.post(`${POST_URL}/${id}/comment`, data);
export const apiDeleteComment = (id) => api.delete(`${POST_URL}/comment/${id}`);

const UPLOAD_URL = "upload";
export const apiUploadAvatar = (formData) =>
  api.post(`${UPLOAD_URL}/avatar`, formData);
export const apiUploadImage = (formData) =>
  api.post(`${UPLOAD_URL}/image`, formData);
