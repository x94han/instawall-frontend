<template>
  <q-dialog
    :modelValue="props.modelValue"
    @update:modelValue="$emit('update:modelValue', !props.modelValue)"
  >
    <q-card flat bordered style="width: 700px; max-width: 80vw">
      <q-card-section horizontal>
        <div class="gt-xs image-side bg-dark col-5 flex">
          <q-img :src="props.post.image" class="self-center" />
        </div>

        <div class="col">
          <q-card-section class="row items-center">
            <div class="row">
              <div class="col-auto q-pr-md">
                <q-avatar size="md">
                  <img :src="props.post.user.avatar || defaultAvatar" />
                </q-avatar>
              </div>
              <div class="self-center text-bold">
                {{ props.post.user.screenName }}
              </div>
            </div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-separator></q-separator>

          <q-card-section style="max-height: 50vh" class="scroll">
            <div class="q-mb-none col self-center">
              <q-avatar size="md" class="q-mr-md">
                <img :src="props.post.user.avatar || defaultAvatar" />
              </q-avatar>
              <span class="text-bold q-mr-sm">{{
                props.post.user.screenName
              }}</span>
              {{ props.post.content }}
            </div>

            <ul class="list-unstyled">
              <li
                v-for="comment in props.post.comments"
                :key="comment._id"
                class="q-mb-md"
              >
                <div class="flex justify-between">
                  <p class="q-mb-none col self-center">
                    <q-avatar size="md" class="q-mr-md">
                      <img :src="comment.user.avatar || defaultAvatar" />
                    </q-avatar>
                    <span class="text-bold q-mr-sm">{{
                      comment.user.screenName
                    }}</span>
                    <span>{{ comment.content }}</span>
                  </p>
                  <div
                    v-if="comment.user._id === authStore.user._id"
                    class="col-auto self-center"
                  >
                    <q-btn
                      @click="toDeleteComment(comment)"
                      :loading="loading === comment._id"
                      flat
                      round
                      size="sm"
                      icon="eva-trash-2-outline"
                    />
                  </div>
                </div>
                <div class="text-caption text-grey">
                  {{ formatData(props.post.createdAt) }}
                </div>
              </li>
            </ul>
          </q-card-section>

          <q-separator></q-separator>

          <q-card-actions>
            <q-btn flat round fab-mini icon="eva-heart-outline" />
            <div v-if="props.post.likes.length > 0" class="text-bold q-ml-sm">
              <a class="cursor-pointer"> {{ props.post.likes.length }} 個讚</a>
            </div>
          </q-card-actions>
          <q-card-section class="q-pt-none text-caption text-grey">
            {{ formatData(props.post.createdAt) }}
          </q-card-section>

          <q-card-section
            v-if="props.post.likes.length > 0"
            class="text-bold q-mb-xs"
          >
            <a class="cursor-pointer"> {{ props.post.likes.length }} 個讚</a>

            <div class="text-caption text-grey">
              {{ formatData(props.post.createdAt) }}
            </div>
          </q-card-section>

          <q-separator></q-separator>

          <q-card-actions class="overflow-hidden">
            <q-input
              v-model="comment"
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
                  :disable="comment.length === 0"
                  :loading="loading === 'comment'"
                  flat
                  color="primary"
                  label="發佈"
                />
              </template>
            </q-input>
          </q-card-actions>
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

const emit = defineEmits(["update:modelValue", "addComment", "deleteComment"]);

const deleteComment = (curComment) => {
  emit("deleteComment", curComment);
};

/**
 * Page Logic
 */
const formatData = (timeStamp) =>
  date.formatDate(new Date(timeStamp), "YYYY年M月D日");

const loading = ref("");
const comment = ref("");

const leaveComment = async () => {
  loading.value = "comment";
  try {
    const { data: newComment } = await apiAddComment(props.post._id, {
      content: comment.value,
    });
    emit("addComment", newComment);
    comment.value = "";
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = "";
  }
};

/**
 * Open CommentDeleteAlert
 */
const toDeleteComment = (comment) => {
  alert.comment = comment;
  alert.handler = true;
};
</script>

<style lang="scss" scoped>
.image-side {
  border-color: black;
}
</style>
