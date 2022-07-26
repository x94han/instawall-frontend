<template>
  <q-dialog
    :modelValue="props.modelValue"
    @update:modelValue="$emit('update:modelValue', !props.modelValue)"
  >
    <q-card flat bordered style="width: 800px; max-width: 80vw">
      <q-card-section horizontal>
        <!-- post image -->
        <div class="gt-xs bg-dark col-5 flex">
          <q-img :src="props.post.image" class="self-center" />
        </div>

        <!-- post -->
        <div class="col">
          <!-- header -->
          <q-card-section class="row items-center">
            <div class="col row">
              <div class="col-auto q-mr-md">
                <router-link
                  :to="{
                    name: 'PersonalPage',
                    params: { userId: props.post.user._id },
                  }"
                >
                  <q-avatar size="md">
                    <img :src="props.post.user.avatar || defaultAvatar" />
                  </q-avatar>
                </router-link>
              </div>
              <div class="col self-center text-bold ellipsis">
                <router-link
                  :to="{
                    name: 'PersonalPage',
                    params: { userId: props.post.user._id },
                  }"
                  class="q-mr-sm link-text text-bold"
                >
                  {{ props.post.user.screenName }}
                </router-link>
              </div>
            </div>
            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
              class="col-auto"
            />
          </q-card-section>

          <q-separator></q-separator>

          <!-- body -->
          <q-card-section
            style="height: 350px; max-height: 50vh"
            class="scroll"
          >
            <!-- post contert -->
            <div class="row q-gutter-md">
              <div class="col-auto">
                <router-link
                  :to="{
                    name: 'PersonalPage',
                    params: { userId: props.post.user._id },
                  }"
                >
                  <q-avatar size="md">
                    <img :src="props.post.user.avatar || defaultAvatar" />
                  </q-avatar>
                </router-link>
              </div>

              <div class="col">
                <p class="q-mb-none">
                  <router-link
                    :to="{
                      name: 'PersonalPage',
                      params: { userId: props.post.user._id },
                    }"
                    class="q-mr-sm link-text text-bold"
                  >
                    {{ props.post.user.screenName }}
                  </router-link>
                  <span class="overflow-wrap-break white-space-line">{{
                    props.post.content
                  }}</span>
                </p>
              </div>

              <div
                v-if="props.post.user._id === authStore.user._id"
                class="col-auto"
              >
                <q-btn
                  @click="actionOptionsHandler = true"
                  flat
                  round
                  size="sm"
                  icon="eva-more-horizontal-outline"
                />
              </div>
            </div>

            <!-- post comments -->
            <ul class="list-unstyled">
              <li
                v-for="comment in props.post.comments"
                :key="comment._id"
                class="q-mb-sm"
              >
                <CommentItem :comment="comment" @delete="onCommentItemDelete" />
              </li>
            </ul>
          </q-card-section>

          <q-separator></q-separator>

          <!-- footer -->
          <div>
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
              <div v-if="props.post.likes.length > 0" class="text-bold q-ml-sm">
                <a class="cursor-pointer">
                  {{ tenThousandths(props.post.likes.length) }} 個讚</a
                >
              </div>
            </q-card-actions>
            <q-card-section class="q-pt-none text-caption text-grey">
              {{
                date.formatDate(new Date(props.post.createdAt), "YYYY年M月D日")
              }}
            </q-card-section>

            <q-separator></q-separator>

            <!-- 留言 -->
            <q-card-actions>
              <q-input
                v-model="commentContent"
                bottom-slots
                borderless
                autogrow
                dense
                hide-bottom-space
                placeholder="留言..."
                input-class="q-pl-sm"
                class="col-12 q-pb-none"
              >
                <template v-slot:after>
                  <q-btn
                    @click="leaveComment"
                    :disable="commentContent.length === 0"
                    :loading="loadingLeave"
                    flat
                    color="primary"
                    label="發佈"
                  />
                </template>
              </q-input>
            </q-card-actions>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <PostActionOptions
    v-model="actionOptionsHandler"
    :post="props.post"
    @delete="feedStore.removePost"
  />
</template>

<script setup>
import { ref, inject, computed } from "vue";
import { date } from "quasar";
import {
  apiAddComment,
  apiLikePost,
  apiUnlikePost,
  apiDeletePost,
} from "src/apis";
import { useAuthStore } from "src/stores/authStore";
import { useFeedStore } from "src/stores/feedStore";
import notifyApiError from "src/utility/notifyApiError";

import CommentItem from "./CommentItem.vue";
import PostActionOptions from "src/components/Post/PostActionOptions.vue";

const authStore = useAuthStore();
const feedStore = useFeedStore();
const defaultAvatar = inject("defaultAvatar");
const tenThousandths = inject("tenThousandths");

/**
 * Component Basics
 */
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  post: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits([
  "update:modelValue",
  "addComment",
  "deleteComment",
  "like",
]);

/**
 * Init
 */
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

/**
 * 留言
 */
const commentContent = ref("");
const loadingLeave = ref(false);

const leaveComment = async () => {
  loadingLeave.value = true;
  try {
    const { data: newComment } = await apiAddComment(props.post._id, {
      content: commentContent.value,
    });
    emits("addComment", newComment);
    commentContent.value = "";
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadingLeave.value = false;
  }
};

/**
 * PostActionOptions
 */
const actionOptionsHandler = ref(false);

const deletePost = async () => {
  try {
    const res = await apiDeletePost(props.post._id);
    isWantDelete.value = false;
    actionOptionsHandler.value = false;
  } catch (error) {
    notifyApiError(error);
  } finally {
  }
};
</script>

<style lang="scss" scoped></style>
