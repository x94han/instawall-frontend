<template>
  <q-dialog
    :modelValue="props.modelValue"
    @update:modelValue="$emit('update:modelValue', !props.modelValue)"
  >
    <q-card flat bordered style="width: 850px; max-width: 80vw">
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
                <q-avatar size="md">
                  <img :src="props.post.user.avatar || defaultAvatar" />
                </q-avatar>
              </div>
              <div class="col self-center text-bold ellipsis">
                {{ props.post.user.screenName }}
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
                <q-avatar size="md">
                  <img :src="props.post.user.avatar || defaultAvatar" />
                </q-avatar>
              </div>

              <div class="col">
                <p class="q-mb-none">
                  <span class="text-bold q-mr-sm">{{
                    props.post.user.screenName
                  }}</span>
                  <span class="overflow-wrap-break">{{
                    props.post.content
                  }}</span>
                </p>
              </div>

              <div
                v-if="props.post.user._id === authStore.user._id"
                class="col-auto"
              >
                <q-btn
                  @click="dialogHandler = true"
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
              <q-btn flat round fab-mini icon="eva-heart-outline" />
              <div v-if="props.post.likes.length > 0" class="text-bold q-ml-sm">
                <a class="cursor-pointer">
                  {{ props.post.likes.length }} 個讚</a
                >
              </div>
            </q-card-actions>
            <q-card-section class="q-pt-none text-caption text-grey">
              {{
                date.formatDate(new Date(props.post.createdAt), "YYYY年M月D日")
              }}
            </q-card-section>

            <q-card-section
              v-if="props.post.likes.length > 0"
              class="text-bold q-mb-xs"
            >
              <a class="cursor-pointer"> {{ props.post.likes.length }} 個讚</a>

              <div class="text-caption text-grey">
                {{
                  date.formatDate(
                    new Date(props.post.createdAt),
                    "YYYY年M月D日"
                  )
                }}
              </div>
            </q-card-section>

            <q-separator></q-separator>

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
                    :loading="loading"
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
</template>

<script setup>
import { ref, inject } from "vue";
import { date } from "quasar";
import { apiAddComment } from "src/apis";
import { useAuthStore } from "src/stores/authStore";
import { useFeedStore } from "src/stores/feedStore";
import notifyApiError from "src/utility/notifyApiError";

import CommentItem from "./CommentItem.vue";

const authStore = useAuthStore();
const feedStore = useFeedStore();
const defaultAvatar = inject("defaultAvatar");

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

const emits = defineEmits(["update:modelValue", "addComment", "deleteComment"]);

/**
 * Page Basics
 */
const onCommentItemDelete = (commentId, postId) => {
  emits("deleteComment", commentId, postId);
};

const commentContent = ref("");
const loading = ref(false);

const leaveComment = async () => {
  loading.value = true;
  try {
    const { data: newComment } = await apiAddComment(props.post._id, {
      content: commentContent.value,
    });
    emits("addComment", newComment);
    commentContent.value = "";
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
