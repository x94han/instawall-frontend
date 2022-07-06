<template>
  <q-page class="q-pa-md card-wrap">
    <template v-if="!authStore.validToken">
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
              :rules="[(val) => validEmail(val) || '請輸入正確格式']"
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
                  validPassword(val) ||
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
    </template>

    <template v-if="authStore.validToken && !loadinglogin">
      <q-card flat bordered class="text-center q-mb-md">
        <q-card-section>
          <h3 class="text-grand-hotel q-my-lg">Instawall</h3>
          <BaseAvatar size="100px" :src="authStore.user.avatar" />
        </q-card-section>

        <q-card-section>
          <q-btn
            :label="`使用 ${authStore.user.screenName} 的身分繼續`"
            type="submit"
            color="primary"
            to="/"
          />
          <q-card-section class="row justify-center">
            <div class="self-center">
              不是 {{ authStore.user.screenName }}？
            </div>
            <q-btn
              flat
              color="primary"
              label="切換帳號"
              @click="switchAccounts"
            />
          </q-card-section>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import BaseAvatar from "src/components/BaseAvatar.vue";
import { useAuthStore } from "src/stores/authStore";
import { validEmail, validPassword } from "src/utility/validator";
import notifyApiError from "src/utility/notifyApiError";

const router = useRouter();
const authStore = useAuthStore();

/**
 *  一般登入
 */
const loginObj = reactive({
  email: "",
  password: "",
});

const reserLoginObj = () => {
  loginObj.email = "";
  loginObj.password = "";
};

const loadinglogin = ref(false);

const onSubmitLogin = async (evt) => {
  loadinglogin.value = true;
  try {
    await authStore.login(loginObj);
    router.push({ name: "HomePage" });
  } catch (error) {
    notifyApiError(error);
  } finally {
    loadinglogin.value = false;
  }
};

/**
 *  第三方登入 // TODO
 */
const loadingFBlogin = ref(false);

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

/**
 *  忘記密碼  //TODO
 */
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

/**
 *  切換帳號
 *  authStore.validToken = true 卡片才會顯示
 */
const switchAccounts = () => {
  authStore.logout();
};
</script>

<style lang="scss" scoped>
.card-wrap {
  max-width: 350px;
  margin: 0 auto;
}
</style>
