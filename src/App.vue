<template>
  <router-view />
</template>

<script>
import { defineComponent, provide } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    provide("defaultAvatar", "src/assets/images/default-avatar.jpg");
    provide("tenThousandths", (number) => {
      return number < 10000
        ? number
        : `${Math.round((number / 10000) * 10) / 10}萬`;
    });
  },
});
</script>
