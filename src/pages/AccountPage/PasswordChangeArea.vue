import { resolveTxt } from "dns/promises";
<template>
  <div class="q-pa-lg">
    <q-form @submit="onSubmit" @reset="onReset" ref="myForm">
      <q-item>
        <q-avatar size="xl" class="q-mr-lg">
          <img :src="authStore.user.avatar ?? defaultAvatar" />
        </q-avatar>
        <span class="text-h6 self-center">{{ authStore.user.screenName }}</span>
      </q-item>
      <q-item class="column">
        <span class="text-subtitle1 text-bold"> 舊密碼 </span>
        <q-input
          v-model.trim="form.currentPassword"
          type="password"
          square
          outlined
          dense
          lazy-rules
          :rules="[
            (val) =>
              validPassword(val) || '密碼長度需大於八碼且數字與英文或符號混合',
          ]"
        />
      </q-item>
      <q-item class="column">
        <span class="text-subtitle1 text-bold"> 新密碼 </span>
        <q-input
          v-model.trim="form.password"
          @change="form.passwordConfirm = ''"
          type="password"
          square
          outlined
          dense
          lazy-rules
          :rules="[
            (val) =>
              validPassword(val) || '密碼長度需大於八碼且數字與英文或符號混合',
          ]"
        />
      </q-item>
      <q-item class="column">
        <span class="text-subtitle1 text-bold"> 確認密碼 </span>
        <q-input
          v-model.trim="form.passwordConfirm"
          type="password"
          square
          outlined
          dense
          lazy-rules
          :rules="[(val) => val === form.password || '密碼輸入不一致']"
        />
      </q-item>
      <q-item>
        <q-btn label="提交" type="submit" color="primary" :loading="loading" />
      </q-item>
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import { useAuthStore } from "src/stores/authStore";
import { validPassword } from "src/utility/validator";
import { apiUpdatePassword } from "src/apis";
import notifyApiError from "src/utility/notifyApiError";
import notifyApiSuccess from "src/utility/notifyApiSuccess";

const authStore = useAuthStore();
const defaultAvatar = inject("defaultAvatar");

const myForm = ref(null);
const form = reactive({
  currentPassword: "",
  password: "",
  passwordConfirm: "",
});
const loading = ref(false);

const onSubmit = async (evt) => {
  loading.value = true;
  try {
    const res = await apiUpdatePassword(form);
    authStore.saveLoginData(res);
    notifyApiSuccess("更新成功");
    myForm.value.reset();
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = false;
  }
};

const onReset = () => {
  form.currentPassword = "";
  form.password = "";
  form.passwordConfirm = "";
};
</script>

<style lang="scss" scoped></style>
