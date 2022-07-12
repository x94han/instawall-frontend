<template>
  <q-dialog v-model="dialog.handler">
    <q-card>
      <q-card-section>
        <div class="row">
          <div class="col-auto q-pr-md">
            <BaseAvatar size="md" :src="dialog.post.user?.avatar" />
          </div>
          <div class="self-center text-bold">
            {{ dialog.post.user?.screenName }}
          </div>
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-section horizontal>
        <div class="col-6">
          <q-img :src="dialog.post.image" />
        </div>

        <q-card-section class="scroll">
          {{ dialog.post.conetnt }}
        </q-card-section>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-actions>
        <q-btn flat round fab-mini icon="eva-heart-outline" />
        <q-btn flat round fab-mini icon="eva-message-circle-outline" />
      </q-card-actions>

      <div v-if="dialog.post?.likes?.length > 0" class="text-bold q-mb-xs">
        <a class="cursor-pointer"> {{ dialog.post.likes.length }} 個讚</a>
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
  </q-dialog>
</template>

<script setup>
import { ref, inject } from "vue";
import { apiAddComment } from "src/apis";
import notifyApiError from "src/utility/notifyApiError";
import BaseAvatar from "src/components/BaseAvatar.vue";

const authStore = inject("authStore");
const dialog = inject("dialog");

const comment = ref("");
const loading = ref(false);
const leaveComment = async () => {
  loading.value = true;
  try {
    const res = await apiAddComment(dialog.post._id, {
      content: comment.value,
    });
    comment.value = "";
    dialog.updateComments(res);
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = false;
  }
};
</script>
