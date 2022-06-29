<template>
  <q-page class="q-pa-md card-wrap">
    <div>
      <q-card flat bordered class="text-center q-mb-md">
        <q-card-section>
          <h3 class="text-grand-hotel q-my-lg">Instawall</h3>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmitLogin" class="column q-gutter-sm">
            <q-input
              v-model.trim="loginObj.email"
              type="email"
              square
              outlined
              dense
              lazy-rules
              :rules="[
                (val) =>
                  globalStore.$validator.isEmail(val) || '請輸入正確格式',
              ]"
              placeholder="電子郵件地址"
            />
            <q-input
              v-model.trim="loginObj.password"
              type="password"
              square
              outlined
              dense
              lazy-rules
              :rules="[
                (val) =>
                  (val.length >= 8 &&
                    !globalStore.$validator.isNumeric(val) &&
                    !globalStore.$validator.isAlpha(val)) ||
                  '密碼長度需大於八碼且數字與英文或符號混合',
              ]"
              placeholder="密碼"
            />

            <q-btn
              label="登入"
              type="submit"
              color="primary"
              :loading="loadinglogin"
            />
          </q-form>
        </q-card-section>

        <q-card-section class="relative-position q-px-md">
          <q-separator></q-separator>
          <div class="absolute-center q-px-md bg-white text-grey text-bold">
            或
          </div>
        </q-card-section>

        <q-card-section>
          <q-btn
            @click="onSubmitFBLogin"
            flat
            color="indigo-10"
            icon="eva-facebook-outline"
            label="使用 Facebook 帳號登入"
            class="text-bold"
            :loading="loadingFBlogin"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <span
            @click="onForgetPassword"
            class="text-caption text-indigo cursor-pointer"
            >忘記密碼？
          </span>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="text-center">
        <q-card-section class="row justify-center">
          <div class="self-center">沒有帳號嗎？</div>
          <q-btn flat color="primary" label="註冊" to="/signUp" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useGlobalStore } from "src/stores/globalStore";
import { apiLogin } from "src/apis";
import notifyApiError from "src/utility/notifyApiError";

const globalStore = useGlobalStore();

const loginObj = reactive({
  email: "",
  password: "",
});

const loadinglogin = ref(false);
const loadingFBlogin = ref(false);

const onSubmitLogin = async (evt) => {
  loadinglogin.value = true;
  try {
    const res = await apiLogin(loginObj);
    console.log("res :>> ", res);
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadinglogin.value = false;
  }
};

// TODO 第三方登入功能
const onSubmitFBLogin = async (evt) => {
  loadingFBlogin.value = true;
  try {
    globalStore.$q.notify({
      color: "brown",
      position: "top",
      message: "功能待開放",
    });
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadingFBlogin.value = false;
  }
};

// TODO 忘記密碼功能
const onForgetPassword = async (evt) => {
  try {
    globalStore.$q.notify({
      color: "brown",
      position: "top",
      message: "功能待開放",
    });
  } catch (error) {
    notifyApiError(error);
  } finally {
  }
};
</script>

<style lang="scss" scoped>
.card-wrap {
  max-width: 350px;
  margin: 0 auto;
}
</style>
