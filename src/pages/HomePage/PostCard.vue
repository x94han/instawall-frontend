<template>
  <q-card class="q-mb-md" flat bordered>
    <!-- card header -->
    <q-item>
      <q-item-section avatar class="col-auto">
        <router-link
          :to="{
            name: 'PersonalPage',
            params: { userId: props.post.user._id },
          }"
        >
          <q-avatar size="md">
            <img :src="props.post.user.avatar ?? defaultAvatar" />
          </q-avatar>
        </router-link>
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <router-link
            :to="{
              name: 'PersonalPage',
              params: { userId: props.post.user._id },
            }"
            class="link-text text-bold"
          >
            {{ props.post.user.screenName }}
          </router-link>
        </q-item-label>
      </q-item-section>
    </q-item>

    <!-- card body & footer -->
    <div>
      <!-- post image -->
      <q-img v-if="props.post.image" :src="props.post.image" />

      <!-- post 操作按鈕 -->
      <q-card-actions>
        <q-btn
          :icon="isLiked ? 'eva-heart' : 'eva-heart-outline'"
          @click="likePost"
          :loading="loadingLike"
          :text-color="isLiked ? 'red' : ''"
          round
          flat
          fab-mini
        />
        <q-btn
          @click="$emit('showComments', props.post)"
          flat
          round
          fab-mini
          icon="eva-message-circle-outline"
        />
      </q-card-actions>

      <!-- post 資訊顯示 -->
      <q-card-section class="q-pt-none">
        <div v-if="props.post.likes.length > 0" class="text-bold q-mb-xs">
          <a class="cursor-pointer">
            {{ tenThousandths(props.post.likes.length) }} 個讚</a
          >
        </div>

        <div class="overflow-wrap-break white-space-line q-mb-sm">
          {{ props.post.content }}
        </div>

        <div
          v-if="props.post.comments.length > 0"
          @click="$emit('showComments', props.post)"
          class="q-mb-sm"
        >
          <a class="cursor-pointer text-body2 text-grey">
            查看全部 {{ tenThousandths(props.post.comments.length) }} 則留言</a
          >
        </div>

        <!-- 自己的留言顯示 -->
        <ul class="list-unstyled">
          <li v-for="comment in commentsByMe" :key="comment._id">
            <CommentItem
              :comment="comment"
              @delete="onCommentItemDelete"
              :avatar="false"
              :createdAt="false"
            />
          </li>
        </ul>

        <div class="text-caption text-grey">
          {{ date.formatDate(new Date(props.post.createdAt), "YYYY年M月D日") }}
        </div>
      </q-card-section>
    </div>
  </q-card>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { date } from "quasar";
import { useAuthStore } from "src/stores/authStore";
import { apiLikePost, apiUnlikePost } from "src/apis";
import notifyApiError from "src/utility/notifyApiError";

import CommentItem from "src/components/CommentItem.vue";

const authStore = useAuthStore();
const defaultAvatar = inject("defaultAvatar");
const tenThousandths = inject("tenThousandths");

/**
 * Component Basics
 */
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["showComments", "deleteComment", "like"]);

/**
 * Init
 */
const commentsByMe = computed(() => {
  if (!props.post.comments) return [];

  return props.post.comments.filter(
    (comment) => comment.user._id === authStore.user._id
  );
});

const onCommentItemDelete = (commentId, postId) => {
  emits("deleteComment", commentId, postId);
};

const isLiked = computed(
  () => props.post.likes?.includes(authStore.user._id) ?? false
);

/**
 * 按讚 / 退讚
 */
const loadingLike = ref(false);

const likePost = async () => {
  loadingLike.value = true;
  try {
    const { data: newPost } = !isLiked.value
      ? await apiLikePost(props.post._id)
      : await apiUnlikePost(props.post._id);
    const { _id, likes } = newPost;
    emits("like", _id, likes);
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadingLike.value = false;
  }
};
</script>
