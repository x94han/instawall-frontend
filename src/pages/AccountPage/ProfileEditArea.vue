<template>
  <div class="q-pa-lg">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="row items-center">
        <q-avatar size="xl" class="q-mr-lg">
          <img :src="form.avatar ?? defaultAvatar" />
        </q-avatar>
        <div class="row items-center">
          <span class="text-subtitle1 text-bold q-mr-lg">{{
            authStore.user.screenName
          }}</span>
          <label
            for="upload"
            class="cursor-pointer text-primary text-bold"
            :class="loading === 'upload' && 'disabled no-pointer-events'"
          >
            變更大頭貼照片
            <q-spinner
              v-if="loading === 'upload'"
              color="primary"
              size="1.5em"
            />
            <input
              @change="uploadAvatar"
              type="file"
              id="upload"
              class="hidden"
            />
          </label>
        </div>
      </div>
      <div>
        <span class="text-subtitle1 text-bold"> 暱稱 </span>
        <q-input
          v-model.trim="form.screenName"
          square
          outlined
          dense
          lazy-rules
          :rules="[(val) => validScreenName(val) || '暱稱需大於兩個字']"
        >
        </q-input>
      </div>
      <div class="q-mb-md">
        <span class="text-subtitle1 text-bold"> 性別 </span>
        <q-option-group
          v-model="form.gender"
          :options="genderOptions"
          color="primary"
          inline
        />
      </div>
      <q-btn
        label="提交"
        type="submit"
        color="primary"
        :loading="loading === 'submit'"
      />
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { validScreenName } from "src/utility/validator";
import { genderOptions } from "src/utility/options";
import { apiGetProfile, apiUploadAvatar, apiUpdateProfile } from "src/apis";
import notifyApiError from "src/utility/notifyApiError";

const router = useRouter();
const authStore = useAuthStore();

const defaultAvatar = inject("defaultAvatar");

/**
 * 初始化
 */
let hasAvatar = false;
const form = reactive({
  avatar: "",
  screenName: "",
  gender: 0,
});
const loading = ref("");

const initData = async () => {
  try {
    const res = await apiGetProfile(authStore.user._id);
    hasAvatar = !!res.data.user.avatar;
    form.avatar = res.data.user.avatar;
    form.screenName = res.data.user.screenName;
    form.gender = res.data.user.gender;
  } catch (error) {
    notifyApiError(error);
  } finally {
  }
};

initData();

/**
 * Form 相關
 */
const uploadAvatar = async (evt) => {
  const [file] = evt.target.files;
  if (!file) return;

  loading.value = "upload";
  try {
    const formdata = new FormData();
    formdata.append("image", file);
    const res = await apiUploadAvatar(formdata);
    form.avatar = res.data.link;
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = "";
  }
};

const onSubmit = async (evt) => {
  loading.value = "submit";
  const { data } = await apiUpdateProfile(authStore.user._id, form);
  console.log("data :>> ", data);
  authStore.updateUser({
    _id: data._id,
    screenName: data.screenName,
    avatar: data.avatar,
  });
  try {
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = "";
  }
};
</script>

<style lang="scss" scoped></style>
