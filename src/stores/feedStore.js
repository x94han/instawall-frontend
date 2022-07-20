import { defineStore } from "pinia";

export const useFeedStore = defineStore("feed", {
  state: () => ({
    posts: [],
    loadingPosts: false,
  }),
  getters: {},
  actions: {
    addComment(newComment) {
      const foundPost = this.posts.find((post) => post._id === newComment.post);
      foundPost && foundPost.comments.push(newComment);
    },
  },
});
