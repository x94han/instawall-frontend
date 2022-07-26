<template>
  <q-dialog
    :modelValue="props.modelValue"
    @update:modelValue="$emit('update:modelValue', !props.modelValue)"
  >
    <q-btn
      icon="close"
      v-close-popup
      flat
      round
      text-color="white"
      class="absolute-top-right"
    />

    <q-card flat bordered style="width: 100%; max-width: 500px">
      <!-- header -->
      <q-item class="row justify-between q-pa-sm">
        <q-btn
          v-show="hasImage"
          icon="eva-arrow-back-outline"
          @click="onClickArrowBack"
          flat
          round
          dense
          class="col-auto"
        />
        <h2 class="col q-my-none text-h6 text-center self-center">
          建立新貼文
        </h2>
        <q-btn
          v-show="hasImage && panel === 'image'"
          @click="panel = 'post'"
          color="primary"
          flat
          dense
          class="col-auto"
        >
          下一步
        </q-btn>
        <q-btn
          v-show="panel === 'post'"
          @click="sharePost"
          :disabled="content.length === 0"
          :loading="loadingShare"
          color="primary"
          flat
          dense
          class="col-auto"
        >
          分享
        </q-btn>
      </q-item>

      <q-separator />

      <!-- body -->
      <q-tab-panels
        v-model="panel"
        keep-alive
        animated
        style="min-height: 400px; height: 70vh"
      >
        <!-- upload image -->
        <q-tab-panel
          name="image"
          class="q-pa-none full-height column justify-center items-center"
        >
          <template v-if="!hasImage">
            <q-icon size="100px" name="eva-image-outline" class="q-mb-md" />
            <h3 class="text-h5 q-mt-none">將相片拖曳到這裡</h3>
            <q-btn
              label="從電腦選擇"
              @click="fileInput.click()"
              :loading="loadingUpload"
              color="primary"
            />
          </template>
          <q-img
            v-else
            :src="image"
            fit="contain"
            height="100%"
            class="bg-black"
          />
          <input
            @change="uploadImage"
            ref="fileInput"
            type="file"
            class="hidden"
          />
        </q-tab-panel>

        <!-- post content -->
        <q-tab-panel name="post">
          <div class="row q-mb-sm">
            <q-item-section avatar class="col-auto">
              <q-avatar size="md">
                <img :src="authStore.user.avatar ?? defaultAvatar" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold ellipsis">
                {{ authStore.user.screenName }}
              </q-item-label>
            </q-item-section>
          </div>
          <q-input
            v-model.trim="content"
            :rules="[(val) => val?.length > 0 || '貼文內容不得為空']"
            maxlength="2200"
            borderless
            counter
            autogrow
            placeholder="撰寫說明文字..."
            type="textarea"
            class="q-pt-none"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>

  <q-dialog v-model="discardHandler">
    <q-card class="text-center" style="width: 300px">
      <q-card-section>
        <h2 class="text-h5">捨棄貼文？</h2>
        <h3 class="text-subtitle1">如果退出，系統將不會儲存你的編輯內容。</h3>
      </q-card-section>
      <q-list>
        <q-item
          @click="discardPost"
          clickable
          v-ripple
          class="text-bold text-negative"
        >
          <q-item-section>捨棄</q-item-section>
        </q-item>
        <q-item clickable v-ripple v-close-popup>
          <q-item-section>取消</q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { watch, ref, inject, computed } from "vue";
import { apiUploadImage, apiAddPost, apiUpdatePost } from "src/apis";
import { useAuthStore } from "src/stores/authStore";
import notifyApiError from "src/utility/notifyApiError";
import notifyApiSuccess from "src/utility/notifyApiSuccess";

import CommentItem from "src/components/CommentItem.vue";

const authStore = useAuthStore();
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
    required: false,
  },
});

const emits = defineEmits(["update:modelValue", "addPost", "updatePost"]);

const hasPropPost = computed(() => props.post != undefined);

/**
 * init
 */
watch(
  () => props.post,
  (post, _) => {
    if (hasPropPost.value) {
      image.value = post.image;
      content.value = post.content;
    }
  }
);

const panel = ref("image");
const fileInput = ref("");

const onClickArrowBack = () => {
  switch (panel.value) {
    case "image":
      discardHandler.value = true;
      break;

    case "post":
      panel.value = "image";
      break;
  }
};

const resetDate = () => {
  image.value = "";
  content.value = "";
  panel.value = "image";
};

/**
 * 上傳圖片
 */
const image = ref("");
const hasImage = computed(() => image.value.length > 0);
const loadingUpload = ref(false);

const uploadImage = async (evt) => {
  const [file] = evt.target.files;
  if (!file) return;

  loadingUpload.value = true;
  try {
    const formdata = new FormData();
    formdata.append("image", file);
    const res = await apiUploadImage(formdata);
    image.value = res.data.link;
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadingUpload.value = false;
  }
};

/**
 * 撰寫與發佈貼文
 */
const content = ref("");
const loadingShare = ref(false);
const sharePost = async () => {
  loadingShare.value = true;
  try {
    if (hasPropPost.value) {
      const res = await apiUpdatePost(props.post._id, {
        image: image.value,
        content: content.value,
      });
      notifyApiSuccess("更新成功");
      emits("updatePost", res.data);
    } else {
      const res = await apiAddPost({
        image: image.value,
        content: content.value,
      });
      notifyApiSuccess("新增成功");
      resetDate();
      emits("addPost", res.data);
    }
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadingShare.value = false;
    emits("update:modelValue", !props.modelValue);
  }
};

/**
 * 捨棄目前貼文
 */
const discardHandler = ref(false);
const discardPost = () => {
  if (hasPropPost.value) {
    discardHandler.value = false;
    emits("update:modelValue", !props.modelValue);
    return;
  }

  resetDate();
  discardHandler.value = false;
};
</script>

<style lang="scss" scoped>
.q-pt-none.q-textarea {
  height: calc(100% - 40px);

  .q-field__inner,
  .q-field__control {
    height: 100%;
  }

  :deep(.q-field__native) {
    height: 100%;
    padding-top: 0px;
  }
}
</style>
