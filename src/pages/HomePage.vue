<template>
  <q-page>
    <div class="constrain row justify-center q-py-md">
      <div class="col-auto">
        <ul class="list-unstyled constrain-cards">
          <li v-if="posts.length === 0" class="text-center">
            <SkeletonCard v-if="loading" />
            <q-card v-else flat bordered>
              <q-card-section class="text-center">
                發布第一則貼文吧！
              </q-card-section>
            </q-card>
          </li>

          <li v-for="post in posts" :key="post._id">
            <PostCard :data="post" />
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
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "src/stores/authStore";
import { apiGetPosts } from "src/apis";
import notifyApiError from "src/utility/notifyApiError";
import BaseAvatar from "src/components/BaseAvatar.vue";
import SkeletonCard from "src/components/SkeletonCard.vue";
import PostCard from "src/components/PostCard.vue";

const authStore = useAuthStore();

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
</script>

<style lang="scss" scoped>
.constrain-cards {
  max-width: 470px;
}
</style>
