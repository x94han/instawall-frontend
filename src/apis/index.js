import { api } from "boot/axios";

const POST_URL = "posts";
export const apiGetPosts = (data) => api.get(`${POST_URL}`, data);
export const apiGetPost = (data) => api.get(`${POST_URL}/`, data);
