<template>
  <q-img @click="clickImage" :src="props.post.image" ratio="1">
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
import { ref, provide, inject } from "vue";
import { useAuthStore } from "src/stores/authStore";
import { useFeedStore } from "src/stores/feedStore";

const authStore = useAuthStore();
const feedStore = useFeedStore();

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const tenThousandths = inject("tenThousandths");

const clickImage = () => {
  console.log("clickImage :>> ");
};
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
