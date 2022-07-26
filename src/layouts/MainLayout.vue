<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white text-grey-10">
      <q-toolbar class="constrain">
        <q-toolbar-title class="text-grand-hotel text-bold">
          Instawall
        </q-toolbar-title>

        <div class="lg-screen-only">
          <q-btn
            icon="eva-home-outline"
            :to="{ name: 'HomePage' }"
            flat
            round
          />
          <q-btn
            icon="eva-plus-square-outline"
            @click="dialogHandler = true"
            flat
            round
          />
          <q-btn flat round>
            <q-avatar size="sm">
              <img :src="authStore.user?.avatar || defaultAvatar" />
            </q-avatar>
            <q-menu transition-show="jump-down" transition-hide="jump-up">
              <q-list style="min-width: 130px">
                <q-item
                  clickable
                  :to="{
                    name: 'PersonalPage',
                    params: { userId: authStore.user?._id },
                  }"
                >
                  <div class="flex items-center q-mr-md">
                    <q-icon size="20px" name="eva-person" />
                  </div>
                  <q-item-section>個人檔案</q-item-section>
                </q-item>
                <q-item
                  clickable
                  :to="{
                    name: 'PersonalPage',
                    params: { userId: authStore.user?._id, tab: 'likes' },
                  }"
                >
                  <div class="flex items-center q-mr-md">
                    <q-icon size="20px" name="eva-heart" />
                  </div>
                  <q-item-section>按讚貼文</q-item-section>
                </q-item>
                <q-item
                  clickable
                  :to="{
                    name: 'PersonalPage',
                    params: { userId: authStore.user?._id, tab: 'likes' },
                  }"
                >
                  <div class="flex items-center q-mr-md">
                    <q-icon size="20px" name="eva-settings-outline" />
                  </div>
                  <q-item-section>設定</q-item-section>
                </q-item>
                <q-separator></q-separator>
                <q-item clickable>
                  <q-item-section>登出</q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <div class="sm-screen-only">
          <q-btn flat round icon="eva-menu-outline">
            <q-menu transition-show="jump-down" transition-hide="jump-up">
              <q-list style="min-width: 130px">
                <q-item
                  clickable
                  :to="{
                    name: 'PersonalPage',
                    params: { userId: authStore.user?._id },
                  }"
                >
                  <div class="flex items-center q-mr-md">
                    <q-icon size="20px" name="eva-person" />
                  </div>
                  <q-item-section>個人檔案</q-item-section>
                </q-item>
                <q-item
                  clickable
                  :to="{
                    name: 'PersonalPage',
                    params: { userId: authStore.user?._id, tab: 'likes' },
                  }"
                >
                  <div class="flex items-center q-mr-md">
                    <q-icon size="20px" name="eva-heart" />
                  </div>
                  <q-item-section>按讚貼文</q-item-section>
                </q-item>
                <q-item clickable>
                  <div class="flex items-center q-mr-md">
                    <q-icon size="20px" name="eva-settings-outline" />
                  </div>
                  <q-item-section>設定</q-item-section>
                </q-item>
                <q-separator></q-separator>
                <q-item clickable>
                  <q-item-section>登出</q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-footer bordered class="bg-white sm-screen-only">
      <q-tabs
        active-color="primary"
        indicator-color="transparent"
        class="text-grey-10"
      >
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab
          @click="dialogHandler = true"
          icon="eva-plus-square-outline"
        />
        <q-route-tab
          :to="{
            name: 'PersonalPage',
            params: { userId: authStore.user?._id },
          }"
        >
          <q-avatar size="sm">
            <img :src="authStore.user?.avatar || defaultAvatar" />
          </q-avatar>
        </q-route-tab>
      </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>

  <PostEditorDialog v-model="dialogHandler" @add-post="feedStore.addPost" />
</template>

<script setup>
import { provide, inject, ref } from "vue";
import { useAuthStore } from "src/stores/authStore";
import { useFeedStore } from "src/stores/feedStore";

import PostEditorDialog from "src/components/Post/PostEditorDialog.vue";

const authStore = useAuthStore();
const feedStore = useFeedStore();
const defaultAvatar = inject("defaultAvatar");

const dialogHandler = ref(false);
</script>

<style lang="scss">
.q-toolbar__title {
  font-size: 30px;
}
</style>
