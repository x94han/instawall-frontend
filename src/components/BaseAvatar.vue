<template>
  <q-avatar :size="props.size">
    <img :src="props.src" />
  </q-avatar>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    required: false,
  },
  src: {
    type: String,
    required: false,
    default: "src/assets/images/default-avatar.jpg",
  },
});
</script>
