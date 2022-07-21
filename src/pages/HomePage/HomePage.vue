<template>
  <q-page>
    <div class="constrain row justify-center q-py-lg">
      <div class="col">
        <ul
          v-if="loading"
          class="list-unstyled q-mt-none q-ml-auto"
          style="max-width: 470px"
        >
          <li v-for="n in 5" :key="n" class="q-mb-md">
            <SkeletonCard />
          </li>
        </ul>

        <ul
          v-else
          class="list-unstyled q-mt-none q-ml-auto"
          style="max-width: 470px"
        >
          <li v-if="feedStore.posts.length === 0" class="text-center">
            <q-card flat bordered>
              <q-card-section class="text-center">
                發布第一則貼文吧！
              </q-card-section>
            </q-card>
          </li>

          <li v-for="post in feedStore.posts" :key="post._id">
            <PostCard
              :post="post"
              @show-comments="openPostDialog"
              @delete-comment="feedStore.removeComment"
              @like="feedStore.updateLikes"
            />
          </li>
        </ul>
      </div>

      <div class="col-4 lg-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <router-link
              :to="{
                name: 'PersonalPage',
                params: { userId: authStore.user._id },
              }"
            >
              <q-avatar>
                <img :src="authStore.user.avatar || defaultAvatar" />
              </q-avatar>
            </router-link>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <router-link
                :to="{
                  name: 'PersonalPage',
                  params: { userId: authStore.user._id },
                }"
                class="link-text text-bold"
              >
                {{ authStore.user.screenName }}
              </router-link></q-item-label
            >
          </q-item-section>
        </q-item>
      </div>
    </div>

    <PostDialog
      v-model="dialogHandler"
      :post="dialogPost"
      @add-comment="feedStore.addComment"
      @delete-comment="feedStore.removeComment"
      @like="feedStore.updateLikes"
    />
  </q-page>
</template>

<script setup>
import { ref, inject } from "vue";
import { useAuthStore } from "src/stores/authStore";
import { useFeedStore } from "src/stores/feedStore";
import { apiGetPosts } from "src/apis";
import notifyApiError from "src/utility/notifyApiError";

import SkeletonCard from "src/components/SkeletonCard.vue";
import PostDialog from "src/components/PostDialog.vue";
import PostCard from "src/pages/HomePage/PostCard.vue";

const authStore = useAuthStore();
const feedStore = useFeedStore();
const defaultAvatar = inject("defaultAvatar");

/**
 * init
 */
const loading = ref(false);

const getData = async () => {
  loading.value = true;
  try {
    const res = await apiGetPosts();
    feedStore.posts = res.data;
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = false;
  }
};

getData();

/**
 * Open PostDialog
 */
const dialogHandler = ref(false);
const dialogPost = ref({});

const openPostDialog = (post) => {
  dialogPost.value = post;
  dialogHandler.value = true;
};
</script>

<style lang="scss" scoped></style>
