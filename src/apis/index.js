import { api } from "boot/axios";

const USER_URL = "users";
export const apiLogin = (data) => api.post(`${USER_URL}/login`, data);
export const apiSignup = (data) => api.post(`${USER_URL}/signup`, data);

const POST_URL = "posts";
export const apiGetPosts = (data) => api.get(`${POST_URL}`, data);
export const apiGetPost = (data) => api.get(`${POST_URL}/`, data);
