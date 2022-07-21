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
    removeComment(commentId, postId) {
      const foundPost = this.posts.find((post) => post._id === postId);
      const idx = foundPost.comments.findIndex(
        (comment) => comment._id === commentId
      );
      ~idx && foundPost.comments.splice(idx, 1);
    },
  },
});
