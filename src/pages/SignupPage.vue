<template>
  <q-page class="q-pa-md card-wrap">
    <q-card flat bordered class="text-center q-mb-md">
      <q-card-section class="column">
        <h1 class="text-h3 text-grand-hotel q-my-lg">Instawall</h1>
        <!-- <h2 class="col text-h6 text-grey text-bold">
          註冊即可查看朋友的照片和貼文。
        </h2>
        <q-btn
          color="primary"
          icon="eva-facebook-outline"
          label="使用 Facebook 帳號登入"
          class="text-bold"
        /> -->
      </q-card-section>

      <!-- <q-card-section class="relative-position q-px-md">
        <q-separator></q-separator>
        <div class="absolute-center q-px-md bg-white text-grey text-bold">
          或
        </div>
      </q-card-section> -->

      <q-card-section>
        <q-form @submit="onSubmit" class="column q-gutter-sm">
          <q-input
            v-model.trim="signUpObj.email"
            type="email"
            square
            outlined
            dense
            lazy-rules
            :rules="[(val) => validEmail(val) || '請輸入正確格式']"
            placeholder="電子郵件地址"
          />
          <q-input
            v-model.trim="signUpObj.screenName"
            type="screenName"
            square
            outlined
            dense
            lazy-rules
            :rules="[(val) => (val && val.length >= 2) || '暱稱需大於兩個字']"
            placeholder="暱稱"
          />
          <q-input
            v-model.trim="signUpObj.password"
            type="password"
            square
            outlined
            dense
            lazy-rules
            :rules="[
              (val) =>
                validPassword(val) ||
                '密碼長度需大於八碼且數字與英文或符號混合',
            ]"
            placeholder="密碼"
          />
          <q-input
            v-model.trim="signUpObj.passwordConfirm"
            type="password"
            square
            outlined
            dense
            lazy-rules
            :rules="[(val) => val === signUpObj.password || '密碼輸入不一致']"
            placeholder="確認密碼"
          />

          <q-btn label="註冊" type="submit" color="primary" />
        </q-form>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="text-center">
      <q-card-section class="row justify-center">
        <div class="self-center">已經有帳號嗎？</div>
        <q-btn flat color="primary" label="登入" to="/login" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { validEmail, validPassword } from "src/utility/validator";
import notifyApiError from "src/utility/notifyApiError";

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const signUpObj = reactive({
  email: "",
  screenName: "",
  password: "",
  passwordConfirm: "",
});

const onSubmit = async (evt) => {
  loading.value = true;
  try {
    await authStore.signup(signUpObj);
    router.push({ name: "HomePage" });
  } catch (error) {
    notifyApiError(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.card-wrap {
  max-width: 350px;
  margin: 0 auto;
}
</style>
