<template>
  <section>
    <div class="row q-px-md q-mb-xl">
      <div class="col-4 text-center q-mr-lg">
        <q-avatar class="fit" style="max-width: 150px">
          <img :src="profile.user?.avatar ?? defaultAvatar" />
        </q-avatar>
      </div>

      <div class="col">
        <div class="row wrap">
          <h2 class="text-h4 q-mt-none q-mr-md q-mb-sm ellipsis">
            {{ profile.user?.screenName }}
          </h2>
          <div>
            <q-btn
              v-if="isLoginUserPage"
              label="編輯個人檔案"
              outline
              class="text-bold q-mr-sm"
              :to="{ name: 'AccountPage' }"
            />
            <template v-else>
              <q-btn
                v-if="!profile.isFollowed"
                label="追蹤"
                @click="followPageOwner(profile)"
                color="primary"
              />
              <q-btn
                v-else
                icon="eva-person-done"
                @click="unfollowPageOwner(profile)"
                outline
                color="primary"
              />
            </template>
          </div>
        </div>

        <ul class="gt-xs list-unstyled row">
          <li class="col-auto q-mr-xl text-subtitle1">
            <span class="text-bold">{{
              tenThousandths(profile.postsCount)
            }}</span>
            貼文
          </li>
          <li class="col-auto q-mr-xl text-subtitle1">
            <a @click="dialog.open('粉絲')" class="cursor-pointer"
              ><span class="text-bold">{{
                tenThousandths(profile.fansCount)
              }}</span>
              位粉絲
            </a>
          </li>
          <li class="col-auto text-subtitle1">
            <a @click="dialog.open('追蹤中')" class="cursor-pointer">
              <span class="text-bold">
                {{ tenThousandths(profile.followingsCount) }}
              </span>
              追蹤中
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="lt-sm">
      <q-separator />

      <ul class="list-unstyled row text-center">
        <li class="col text-subtitle2">
          <span class="text-bold">{{
            tenThousandths(profile.postsCount)
          }}</span>
          <span class="block text-grey"> 貼文 </span>
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
    </div>
  </section>

  <q-dialog v-model="dialog.handler">
    <q-card style="width: 100vw; max-width: 400px">
      <q-card-section class="row q-pa-sm">
        <div class="col text-h6 text-center self-center">
          {{ dialog.title }}
        </div>
        <q-btn icon="close" flat round dense v-close-popup class="col-auto" />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <ul class="list-unstyled q-ma-none">
          <li v-if="dialog.users.length == 0" class="text-center">
            {{ `目前無${dialog.title}。` }}
          </li>
          <li
            v-for="item in dialog.users"
            :key="item.user._id"
            class="row justify-between q-mb-sm"
          >
            <div class="col">
              <div class="row">
                <div class="q-pr-md">
                  <router-link
                    :to="{
                      name: 'PersonalPage',
                      params: { userId: item.user._id },
                    }"
                  >
                    <q-avatar size="lg">
                      <img :src="item.user.avatar ?? defaultAvatar" />
                    </q-avatar>
                  </router-link>
                </div>
                <div class="self-center text-bold">
                  <router-link
                    :to="{
                      name: 'PersonalPage',
                      params: { userId: item.user._id },
                    }"
                    class="link-text"
                  >
                    {{ item.user.screenName }}
                  </router-link>
                </div>
              </div>
            </div>
            <div class="col-auto self-center">
              <q-btn
                v-if="item.isFollowed"
                label="追蹤中"
                @click="unfollowUser(item)"
                :loading="loadingBtn === item.user._id"
                outline
                color="primary"
              />
              <q-btn
                v-else-if="item.user._id !== authStore.user._id"
                label="追蹤"
                @click="followUser(item)"
                :loading="loadingBtn === item.user._id"
                color="primary"
              />
            </div>
          </li>
        </ul>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, inject, reactive } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import {
  apiGetProfile,
  apiGetFans,
  apiGetFollowings,
  apiFollowUser,
  apiUnfollowUser,
} from "src/apis";
import notifyApiError from "src/utility/notifyApiError";

const route = useRoute();
const authStore = useAuthStore();

const defaultAvatar = inject("defaultAvatar");
const tenThousandths = inject("tenThousandths");
const isLoginUserPage = inject("isLoginUserPage");

/**
 * 頁面初始化
 */
const profile = ref({});

const initData = async () => {
  try {
    const res = await apiGetProfile(route.params.userId);
    profile.value = res.data;
  } catch (error) {
    notifyApiError(error);
  } finally {
  }
};

const dialog = reactive({
  handler: false,
  title: "",
  users: [],
  open: async (title) => {
    dialog.handler = true;
    dialog.title = title;
    try {
      const res =
        title === "粉絲"
          ? await apiGetFans(route.params.userId)
          : await apiGetFollowings(route.params.userId);
      dialog.users = res.data;
    } catch (error) {
      notifyApiError(error);
      dialog.handler = false;
    }
  },
});

initData();

onBeforeRouteUpdate(async (to, from) => {
  initData();
});

/**
 * 追蹤 / 退追蹤
 */
const loadingBtn = ref("");

const followPageOwner = async (target) => {
  loadingBtn.value = target.user._id;
  try {
    await apiFollowUser(target.user._id);
    target.isFollowed = true;
    target.fansCount++;
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadingBtn.value = "";
  }
};

const unfollowPageOwner = async (target) => {
  loadingBtn.value = target.user._id;
  try {
    await apiUnfollowUser(target.user._id);
    target.isFollowed = false;
    target.fansCount--;
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadingBtn.value = "";
  }
};

const followUser = async (target) => {
  loadingBtn.value = target.user._id;
  try {
    await apiFollowUser(target.user._id);
    target.isFollowed = true;
    profile.value.followingsCount++;
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadingBtn.value = "";
  }
};

const unfollowUser = async (target) => {
  loadingBtn.value = target.user._id;
  try {
    await apiUnfollowUser(target.user._id);
    target.isFollowed = false;
    profile.value.followingsCount--;
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadingBtn.value = "";
  }
};
</script>

<style lang="scss" scoped></style>
