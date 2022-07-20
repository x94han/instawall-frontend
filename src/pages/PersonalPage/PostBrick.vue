<template>
  <q-img
    @click="emit('showPost', props.post)"
    :src="props.post.image"
    ratio="1"
  >
    <div class="mask absolute-full text-subtitle2 flex flex-center">
      <ul class="mask__content list-unstyled flex flex-center wrap">
        <li class="q-mr-md">
          <q-icon size="sm" name="eva-heart" />
          {{ tenThousandths(props.post.likes.length) }}
        </li>
        <li>
          <q-icon size="sm" name="eva-message-circle" />
          {{ tenThousandths(props.post.comments.length) }}
        </li>
      </ul>
    </div>
  </q-img>
</template>

<script setup>
import { ref, inject } from "vue";
import { useAuthStore } from "src/stores/authStore";
import { useFeedStore } from "src/stores/feedStore";

const authStore = useAuthStore();
const feedStore = useFeedStore();
const tenThousandths = inject("tenThousandths");

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["showPost"]);
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
