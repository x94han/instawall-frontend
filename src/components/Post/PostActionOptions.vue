<template>
  <q-dialog
    :modelValue="props.modelValue"
    @update:modelValue="$emit('update:modelValue', !props.modelValue)"
  >
    <q-card class="text-center" style="width: 300px">
      <q-list v-if="!isWantDelete">
        <q-item
          @click="isWantDelete = true"
          clickable
          v-ripple
          class="text-bold text-negative"
        >
          <q-item-section>刪除</q-item-section>
        </q-item>
        <q-item @click="toEditPost" clickable v-ripple>
          <q-item-section>編輯</q-item-section>
        </q-item>
        <q-item clickable v-ripple v-close-popup>
          <q-item-section>取消</q-item-section>
        </q-item>
      </q-list>

      <template v-else>
        <q-card-section>
          <h2 class="text-h5">刪除貼文？</h2>
          <h3 class="text-subtitle1">確定要刪除這則貼文？</h3>
        </q-card-section>
        <q-list>
          <q-item
            @click="deletePost"
            :disable="loading"
            clickable
            v-ripple
            class="text-bold text-negative"
          >
            <q-item-section>刪除</q-item-section>
          </q-item>
          <q-item @click="isWantDelete = false" clickable v-ripple>
            <q-item-section>取消</q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-card>
  </q-dialog>

  <PostEditorDialog
    v-model="editorDialogHandler"
    :post="props.post"
    @update-post="feedStore.updatePost"
  />
</template>

<script setup>
import { ref } from "vue";
import { apiDeletePost } from "src/apis";
import { useFeedStore } from "src/stores/feedStore";
import notifyApiError from "src/utility/notifyApiError";
import PostEditorDialog from "src/components/Post/PostEditorDialog.vue";

const feedStore = useFeedStore();

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

const emits = defineEmits(["update:modelValue", "edit", "delete"]);

/**
 * PostEditorDialog
 */
const editorDialogHandler = ref(false);
const toEditPost = () => {
  editorDialogHandler.value = true;
  emits("update:modelValue", false);
};

/**
 * Delete Post
 */
const isWantDelete = ref(false);
const loading = ref(false);

const deletePost = async () => {
  loading.value = true;
  try {
    const { data } = await apiDeletePost(props.post._id);
    emits("delete", data.post);
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = false;
    isWantDelete.value = false;
    emits("update:modelValue", false);
  }
};
</script>
