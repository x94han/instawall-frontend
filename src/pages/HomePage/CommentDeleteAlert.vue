<template>
  <q-dialog v-model="alert.handler">
    <q-card style="width: 300px">
      <q-card-section>
        <div class="text-h6">確定刪除？</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <span class="text-bold">留言：</span>
        <p>{{ alert.comment.content }}</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="取消" outline color="primary" v-close-popup />
        <q-btn
          @click="deleteComment"
          :loading="loading"
          label="確定"
          outline
          color="negative"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, inject } from "vue";

const alert = inject("alert");

const loading = ref(false);
const deleteComment = async () => {
  loading.value = true;
  try {
    await alert.deleteComment(alert.comment.post, alert.comment._id);
  } finally {
    loading.value = false;
  }
};
</script>
