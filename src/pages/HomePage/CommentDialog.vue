<template>
  <q-dialog v-model="dialog.handler">
    <div class="row">
      <q-card class="col">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-auto q-pr-md">
              <BaseAvatar size="md" :src="dialog.post.user?.avatar" />
            </div>
            <div class="self-center text-bold">
              {{ dialog.post.user?.screenName }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator></q-separator>

        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="q-mb-none col self-center">
            <BaseAvatar
              size="md"
              :src="dialog.post.user?.avatar"
              class="q-mr-md"
            />
            <span class="text-bold q-mr-sm">{{
              dialog.post.user?.screenName
            }}</span>
            {{ dialog.post.content }}
          </div>

          <ul class="list-unstyled">
            <li
              v-for="comment in dialog.post.comments"
              :key="comment._id"
              class="q-mb-md"
            >
              <div class="flex justify-between">
                <p class="q-mb-none col self-center">
                  <BaseAvatar
                    size="md"
                    :src="comment.user.avatar"
                    class="q-mr-md"
                  />
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
                    @click="deleteComment(dialog.post._id, comment._id)"
                    flat
                    round
                    padding="xs"
                    icon="eva-trash-2-outline"
                  />
                </div>
              </div>
              <div class="text-caption text-grey">
                {{ formatData(dialog.post.createdAt) }}
              </div>
            </li>
          </ul>
        </q-card-section>

        <q-separator></q-separator>

        <q-card-actions>
          <q-btn flat round fab-mini icon="eva-heart-outline" />
        </q-card-actions>

        <div v-if="dialog.post?.likes?.length > 0" class="text-bold q-mb-xs">
          <a class="cursor-pointer"> {{ dialog.post.likes.length }} 個讚</a>

          <div class="text-caption text-grey">
            {{ formatData(dialog.post.createdAt) }}
          </div>
        </div>

        <q-separator></q-separator>

        <q-card-actions class="overflow-hidden">
          <q-input
            v-model="comment"
            bottom-slots
            borderless
            autogrow
            dense
            placeholder="留言..."
            input-class="q-pl-sm"
            class="col-12 q-pb-none"
          >
            <template v-slot:after>
              <q-btn
                @click="leaveComment"
                :disable="comment.length === 0"
                :loading="loading"
                flat
                color="primary"
                label="發佈"
              />
            </template>
          </q-input>
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, inject } from "vue";
import { date } from "quasar";
import { apiAddComment } from "src/apis";
import { useAuthStore } from "src/stores/authStore";
import notifyApiError from "src/utility/notifyApiError";
import BaseAvatar from "src/components/BaseAvatar.vue";

const authStore = useAuthStore();

const dialog = inject("dialog");
const deleteComment = inject("deleteComment");

const formatData = (timeStamp) =>
  date.formatDate(new Date(timeStamp), "YYYY年M月D日");

const comment = ref("");
const loading = ref(false);
const leaveComment = async () => {
  loading.value = true;
  try {
    const res = await apiAddComment(dialog.post._id, {
      content: comment.value,
    });
    res.data.user = { ...authStore.user };
    dialog.updateComments(res.data);
    comment.value = "";
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = false;
  }
};
</script>
