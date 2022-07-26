<template>
  <q-page>
    <div class="constrain justify-center q-py-lg">
      <ProfileSection />

      <section>
        <q-separator />
        <q-tabs
          v-model="tab"
          @update:model-value="renewPosts"
          switch-indicator
          inline-label
          active-color="dark"
          indicator-color="dark"
          narrow-indicator
          class="q-mb-md text-grey"
        >
          <q-tab name="posts" label="貼文" icon="eva-grid-outline" />
          <q-tab
            v-if="isLoginUserPage"
            name="likes"
            label="按讚貼文"
            icon="eva-heart-outline"
          />
        </q-tabs>

        <div class="relative-position">
          <ul class="list-unstyled row q-col-gutter-lg">
            <li
              v-for="post in feedStore.posts"
              :key="post._id"
              class="col-4 cursor-pointer"
            >
              <PostBrick :post="post" @show-post="openPostDialog" />
            </li>
          </ul>

          <div
            v-if="feedStore.posts.length === 0"
            class="q-pa-lg text-center text-body1"
          >
            <template v-if="tab === 'posts'">
              <q-avatar size="100px" icon="eva-grid-outline" />
              <p v-if="isLoginUserPage">快來發布你的第一則貼文吧！</p>
              <p v-else>該用戶沒有任何貼文。</p>
            </template>
            <template v-else-if="tab === 'likes'">
              <q-avatar size="100px" icon="eva-heart-outline" />
              <p>可以查看你讚過的貼文。只有你可以查看你按過讚的貼文的內容。</p>
            </template>
          </div>

          <q-inner-loading
            :showing="feedStore.loadingPosts"
            label="Please wait..."
            label-style="font-size: 1.1em"
          />
        </div>
      </section>
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
import { ref, provide, computed } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { useFeedStore } from "src/stores/feedStore";
import { apiGetPosts, apiGetLikePosts } from "src/apis";
import { validObjectId } from "src/utility/validator";
import notifyApiError from "src/utility/notifyApiError";

import ProfileSection from "src/pages/PersonalPage/ProfileSection.vue";
import PostBrick from "src/components/Post/PostBrick.vue";
import PostDialog from "src/components/Post/PostDialog.vue";

const route = useRoute();
const authStore = useAuthStore();
const feedStore = useFeedStore();

/**
 * 頁面初始化
 */
const isLoginUserPage = computed(
  () => authStore.user._id === route.params.userId
);
provide("isLoginUserPage", isLoginUserPage);

const tab = ref(route.params.tab || "posts");

const initData = async () => {
  feedStore.loadingPosts = true;
  try {
    const res =
      tab.value === "posts"
        ? await apiGetPosts({ user: route.params.userId })
        : await apiGetLikePosts();
    feedStore.posts = res.data;
  } catch (error) {
    notifyApiError(error);
  } finally {
    feedStore.loadingPosts = false;
  }
};

initData();

onBeforeRouteUpdate(async (to, from) => {
  if (to.params.userId !== from.params.userId) {
    if (!validObjectId(to.params.userId)) return { name: "NotFoundPage" };

    route.params.userId = to.params.userId;
    initData();
  }
});

/**
 * 根據 tab 撈貼文資料
 */
const renewPosts = async (val) => {
  feedStore.loadingPosts = true;
  try {
    const res =
      val === "posts"
        ? await apiGetPosts({ user: route.params.userId })
        : await apiGetLikePosts();
    feedStore.posts = res.data;
  } catch (error) {
    notifyApiError(error);
  } finally {
    feedStore.loadingPosts = false;
  }
};

/**
 * PostDialog
 */
const dialogHandler = ref(false);
const dialogPost = ref({});
const openPostDialog = (post) => {
  dialogPost.value = post;
  dialogHandler.value = true;
};
</script>

<style lang="scss" scoped></style>
