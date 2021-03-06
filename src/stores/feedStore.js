import { defineStore } from "pinia";

export const useFeedStore = defineStore("feed", {
  state: () => ({
    posts: [],
    loadingPosts: false,
  }),
  getters: {},
  actions: {
    /**
     * 新增貼文
     * @param {object} newPost 新的留言
     */
    addPost(newPost) {
      this.posts.unshift(newPost);
    },

    /**
     * 更新貼文
     * @param {object} post 新的貼文資料
     */
    updatePost(newPost) {
      const foundPost = this.posts.find((post) => post._id === newPost._id);
      if (foundPost) {
        foundPost.image = newPost.image;
        foundPost.content = newPost.content;
      }
    },

    /**
     * 移除貼文
     * @param {object} postId 移除的貼文
     */
    removePost(postId) {
      const idx = this.posts.findIndex((post) => post._id === postId);
      ~idx && this.posts.splice(idx, 1);
    },

    /**
     * 新增貼文的留言
     * @param {object} newComment 新的留言資料
     */
    addComment(newComment) {
      const foundPost = this.posts.find((post) => post._id === newComment.post);
      foundPost && foundPost.comments.push(newComment);
    },

    /**
     * 移除貼文的留言
     * @param {string} commentId 移除哪則留言
     * @param {string} postId 哪則貼文底下的留言
     */
    removeComment(commentId, postId) {
      const foundPost = this.posts.find((post) => post._id === postId);
      const idx = foundPost.comments.findIndex(
        (comment) => comment._id === commentId
      );
      ~idx && foundPost.comments.splice(idx, 1);
    },

    /**
     * 更新貼文的按讚者陣列
     * @param {array} postId 對哪則貼文按讚/退讚
     * @param {array} likes 更新後的按讚者陣列
     */
    updateLikes(postId, likes) {
      const foundPost = this.posts.find((post) => post._id === postId);
      if (foundPost) {
        foundPost.likes = likes;
      }
    },
  },
});
