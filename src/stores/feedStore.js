import { defineStore } from "pinia";

export const useFeedStore = defineStore("feed", {
  state: () => ({
    posts: [],
    loadingPosts: false,
  }),
  getters: {},
  actions: {},
});
