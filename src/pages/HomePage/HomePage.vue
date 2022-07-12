<template>
  <q-page>
    <div class="constrain row justify-center q-py-md">
      <div class="col">
        <ul class="list-unstyled q-ml-auto" style="max-width: 470px">
          <li v-if="posts.length === 0" class="text-center">
            <SkeletonCard v-if="loading" class="full-width" />
            <q-card v-else flat bordered>
              <q-card-section class="text-center">
                發布第一則貼文吧！
              </q-card-section>
            </q-card>
          </li>

          <li v-for="post in posts" :key="post._id">
            <PostCard :post="post" />
          </li>
        </ul>
      </div>

      <div class="col-4 lg-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <BaseAvatar :src="authStore.user.avatar" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">{{
              authStore.user.screenName
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>

    <CommentDialog />
  </q-page>
</template>

<script setup>
import { ref, reactive, provide, readonly } from "vue";
import { useAuthStore } from "src/stores/authStore";
import { apiGetPosts, apiAddComment } from "src/apis";
import notifyApiError from "src/utility/notifyApiError";
import BaseAvatar from "src/components/BaseAvatar.vue";
import SkeletonCard from "src/components/SkeletonCard.vue";
import PostCard from "src/pages/HomePage/PostCard.vue";
import CommentDialog from "src/pages/HomePage/CommentDialog.vue";

const authStore = useAuthStore();

/**
 * Get posts
 */
const posts = ref([]);
const loading = ref(false);
const getData = async () => {
  loading.value = true;
  try {
    const res = await apiGetPosts();
    posts.value = res.data;
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = false;
  }
};

getData();

/**
 * Leave comment & Update post for posts
 */
const dialog = reactive({
  post: {},
  updateComments: (newComment) => {
    const foundPost = posts.value.find((post) => post._id === newComment.post);
    foundPost.comments.push(newComment);
    dialogPost.value = foundPost;
  },
  handler: false,
});
provide("dialog", dialog);
</script>

<style lang="scss" scoped></style>
