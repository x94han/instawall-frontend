<template>
  <router-view />
</template>

<script>
import { defineComponent, provide } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    provide("defaultAvatar", "src/assets/images/default-avatar.jpg");
  },
});
</script>
