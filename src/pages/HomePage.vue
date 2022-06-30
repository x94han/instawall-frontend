<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-md">
      <ul class="col list-unstyled">
        <li v-if="posts.length === 0" class="text-center">
          發布第一則貼文吧！
        </li>
        <li v-for="post in posts" :key="post._id">
          <PostCard :data="post" />
        </li>
      </ul>

      <div class="col-4 lg-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <BaseAvatar />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">Title</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import BaseAvatar from "src/components/BaseAvatar.vue";
import PostCard from "src/components/PostCard.vue";
import { apiGetPosts } from "src/apis";
import notifyApiError from "src/utility/notifyApiError";

const posts = ref([]);

const getData = async () => {
  try {
    const res = await apiGetPosts();
    posts.value = res.data;
  } catch (error) {
    notifyApiError(error);
  }
};

getData();
</script>
