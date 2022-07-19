<template>
  <q-page>
    <div class="constrain justify-center q-py-lg">
      <q-splitter
        v-model="splitterModel"
        class="bg-white"
        style="border: 1px rgba(0, 0, 0, 0.12) solid"
      >
        <template v-slot:before>
          <q-tabs v-model="tab" vertical switch-indicator>
            <q-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :label="tab.label"
              content-class="q-px-md q-mr-auto"
            />
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            vertical
            switch-indicator
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel v-for="tab in tabs" :key="tab.name" :name="tab.name">
              <component :is="tab.component" />
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </div>
  </q-page>
</template>

<script setup>
import { ref, provide, inject } from "vue";
import { useAuthStore } from "src/stores/authStore";

import ProfileEditArea from "src/pages/AccountPage/ProfileEditArea.vue";
import PasswordChangeArea from "src/pages/AccountPage/PasswordChangeArea.vue";

const authStore = useAuthStore();

const defaultAvatar = inject("defaultAvatar");

/**
 * 初始化
 */
const tabs = [
  {
    name: "profile",
    label: "編輯個人檔案",
    component: ProfileEditArea,
  },
  {
    name: "password",
    label: "更改密碼",
    component: PasswordChangeArea,
  },
];
const splitterModel = ref(20); // 控制導覽列寬度
const tab = ref("profile");
</script>

<style lang="scss" scoped></style>
