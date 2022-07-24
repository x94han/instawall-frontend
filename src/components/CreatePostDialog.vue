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

    <q-card flat bordered style="width: 400px; height: 60vh">
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
        class="shadow-2 rounded-borders"
      >
        <q-tab-panel name="image">
          <div v-if="!hasImage" class="column justify-center items-center">
            <q-icon size="100px" name="eva-image-outline" class="q-mb-md" />
            <h3 class="text-h5 q-mt-none">將相片拖曳到這裡</h3>
            <q-btn
              label="從電腦選擇"
              @click="fileInput.click()"
              :loading="loadingUpload"
              color="primary"
            />
          </div>
          <q-img v-else :src="image" />
          <input
            @change="uploadImage"
            ref="fileInput"
            type="file"
            class="hidden"
          />
        </q-tab-panel>

        <q-tab-panel name="post">
          <div>
            <q-item class="q-pt-none q-px-none">
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
            </q-item>

            <q-item-section>
              <q-input
                v-model.trim="content"
                :rules="[(val) => val?.length > 0 || '貼文內容不得為空']"
                maxlength="2200"
                filled
                borderless
                counter
                placeholder="撰寫說明文字..."
                type="textarea"
              />
            </q-item-section>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import { apiUploadImage, apiAddPost } from "src/apis";
import { useAuthStore } from "src/stores/authStore";
import notifyApiError from "src/utility/notifyApiError";
import notifyApiSuccess from "src/utility/notifyApiSuccess";

import CommentItem from "./CommentItem.vue";

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
});

const emits = defineEmits(["update:modelValue", "addPost"]);

/**
 * init
 */
const panel = ref("image");
const fileInput = ref("");

const onClickArrowBack = () => {
  switch (panel.value) {
    case "image":
      image.value = "";
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
const image = ref("https://i.imgur.com/HO4DQzr.jpg");
// const image = ref("");
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
    const res = await apiAddPost({
      image: image.value,
      content: content.value,
    });
    notifyApiSuccess("新增成功");
    resetDate();
    emits("addPost", res.data);
    emits("update:modelValue", !props.modelValue);
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadingShare.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
