<template>
  <q-page>
    <div class="constrain justify-center q-py-lg">
      <section class="row q-mb-xl q-px-md">
        <div class="col-4 text-center">
          <q-avatar size="150px">
            <img :src="profile.user?.avatar ?? defaultAvatar" />
          </q-avatar>
        </div>

        <div class="col">
          <div class="row">
            <h2 class="text-h4 q-my-none q-mr-md ellipsis">
              {{ profile.user?.screenName }}
            </h2>
            <div class="self-center">
              <q-btn label="編輯個人檔案" outline class="text-bold" />
            </div>
          </div>

          <ul class="gt-xs list-unstyled row">
            <li class="col-auto q-mr-xl text-subtitle1">
              <a class="cursor-pointer"
                ><span class="text-bold">{{
                  tenThousandths(profile.postsCount)
                }}</span>
                貼文
              </a>
            </li>
            <li class="col-auto q-mr-xl text-subtitle1">
              <a class="cursor-pointer"
                ><span class="text-bold">{{
                  tenThousandths(profile.fansCount)
                }}</span>
                位粉絲
              </a>
            </li>
            <li class="col-auto text-subtitle1">
              <a class="cursor-pointer">
                <span class="text-bold">
                  {{ tenThousandths(profile.followingsCount) }}
                </span>
                追蹤中
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section class="lt-sm">
        <q-separator />

        <ul class="list-unstyled row text-center">
          <li class="col text-subtitle2">
            <a class="cursor-pointer"
              ><span class="text-bold">{{
                tenThousandths(profile.postsCount)
              }}</span>
              <span class="block text-grey"> 貼文 </span>
            </a>
          </li>
          <li class="col text-subtitle2">
            <a class="cursor-pointer"
              ><span class="text-bold">{{
                tenThousandths(profile.fansCount)
              }}</span>
              <span class="block text-grey"> 位粉絲 </span>
            </a>
          </li>
          <li class="col text-subtitle2">
            <a class="cursor-pointer">
              <span class="text-bold">
                {{ tenThousandths(profile.followingsCount) }}
              </span>
              <span class="block text-grey"> 追蹤中 </span>
            </a>
          </li>
        </ul>
      </section>

      <q-separator />

      <section>
        <q-tabs
          v-model="tab"
          switch-indicator
          inline-label
          class="text-grey"
          active-color="dark"
          indicator-color="dark"
          narrow-indicator
        >
          <q-tab name="posts" label="貼文" icon="eva-grid-outline" />
          <q-tab name="likes" label="按讚貼文" icon="eva-heart-outline" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated class="bg-grey-1">
          <q-tab-panel name="posts">
            <div class="row q-col-gutter-sm">
              <a
                v-for="post in posts"
                :key="post._id"
                class="col-4 cursor-pointer"
              >
                <q-img @click="clickImage" :src="post.image" ratio="1">
                  <div
                    class="mask absolute-full text-subtitle2 flex flex-center"
                  >
                    <ul
                      class="mask__content list-unstyled flex flex-center wrap"
                    >
                      <li class="q-mr-md">
                        <q-icon size="sm" name="eva-heart" />
                        {{ tenThousandths(post.likes.length) }}
                      </li>
                      <li>
                        <q-icon size="sm" name="eva-message-circle" />
                        {{ tenThousandths(post.comments.length) }}
                      </li>
                    </ul>
                  </div>
                </q-img>
              </a>
            </div>
          </q-tab-panel>

          <q-tab-panel name="likes">
            <div class="text-h6">按讚貼文</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { useFeedStore } from "src/stores/feedStore";
import { apiGetPosts, apiGetProfile } from "src/apis";
import notifyApiError from "src/utility/notifyApiError";

const route = useRoute();
const authStore = useAuthStore();
const feedStore = useFeedStore();

const defaultAvatar = inject("defaultAvatar");
const userId = route.params.userId;

const tab = ref("posts");

/**
 * test funciton
 */
const clickImage = () => {
  console.log("clickImage :>> ");
};

/**
 * 格式化萬分位
 */
const tenThousandths = (number) => {
  return number < 10000
    ? number
    : `${Math.round((number / 10000) * 10) / 10}萬`;
};

/**
 * Get user data
 */

const profile = ref({
  user: {
    _id: "629c5db540a4af0ef2f58a93",
    email: "someone@gmail.com",
    screenName: "someone",
    gender: 2,
  },
  postsCount: 1,
  fansCount: 0,
  followingsCount: 2,
  isFollowed: false,
});

// fetchProfile(userId);

/**
 * Get posts
 */
const posts = ref([]);
const loading = ref(false);
const fetchPosts = async () => {
  loading.value = true;
  try {
    const res = await apiGetPosts({ user: userId });
    posts.value = res.data;
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = false;
  }
};

fetchPosts();
</script>

<style lang="scss" scoped>
.q-img__content .mask {
  background: rgba(0, 0, 0, 0);

  .mask__content {
    display: none;
  }
}

.q-img__content:hover .mask {
  background: rgba(0, 0, 0, 0.47);

  .mask__content {
    display: flex;
  }
}
</style>
