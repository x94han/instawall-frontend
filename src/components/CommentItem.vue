<template>
  <div class="row q-gutter-md">
    <div v-if="props.avatar" class="col-auto">
      <router-link
        :to="{
          name: 'PersonalPage',
          params: { userId: props.comment.user._id },
        }"
      >
        <q-avatar size="md">
          <img :src="props.comment.user.avatar || defaultAvatar" />
        </q-avatar>
      </router-link>
    </div>

    <div class="col">
      <p class="q-mb-none">
        <router-link
          :to="{
            name: 'PersonalPage',
            params: { userId: props.comment.user._id },
          }"
          class="q-mr-sm link-text text-bold"
        >
          {{ props.comment.user.screenName }}
        </router-link>
        <span class="overflow-wrap-break">{{ props.comment.content }}</span>
      </p>
      <div v-if="props.createdAt" class="text-caption text-grey">
        {{ date.formatDate(new Date(props.comment.createdAt), "YYYY年M月D日") }}
      </div>
    </div>

    <div v-if="props.comment.user._id === authStore.user._id" class="col-auto">
      <q-btn
        @click="dialogHandler = true"
        flat
        round
        size="sm"
        icon="eva-more-horizontal-outline"
      />
    </div>
  </div>

  <q-dialog v-model="dialogHandler">
    <q-card style="width: 300px">
      <q-list class="text-center">
        <q-item
          @click="onClickItemDelete"
          clickable
          v-ripple
          class="text-bold text-negative"
        >
          <q-item-section>刪除</q-item-section>
        </q-item>
        <q-item clickable v-ripple v-close-popup class="">
          <q-item-section>取消</q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, inject } from "vue";
import { date } from "quasar";
import { useAuthStore } from "src/stores/authStore";
import { apiDeleteComment } from "src/apis";
import notifyApiError from "src/utility/notifyApiError";

const authStore = useAuthStore();
const defaultAvatar = inject("defaultAvatar");

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  avatar: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["delete"]);

/**
 * 刪除留言
 */
const dialogHandler = ref(false);
const loading = ref(false);

const onClickItemDelete = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    await apiDeleteComment(props.comment._id);
    emits("delete", props.comment._id, props.comment.post);
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = false;
    dialogHandler.value = false;
  }
};
</script>
