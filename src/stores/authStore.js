import { defineStore } from "pinia";
import { Cookies } from "quasar";
import { apiLogin, apiSignup } from "src/apis";

const cookieOptions = {
  expires: "1d",
  // httpOnly: true,
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: Cookies.get("iwAccessToken"),
    user: Cookies.get("iwUser"), // { _id, screenName, avatar }
  }),
  getters: {
    validToken() {
      return this.token ? true : false;
    },
  },
  actions: {
    async login(param) {
      const res = await apiLogin(param);
      this.saveLoginData(res);
    },
    async signup(param) {
      const res = await apiSignup(param);
      this.saveLoginData(res);
    },

    /**
     * 更新 authStore.token, authStore.user 以及其 Cookies
     * @param {{ status: string, data: { user: object, token: string}} } res
     */
    saveLoginData(res) {
      const { _id, screenName, avatar } = res.data.user;

      this.token = res.data.token;
      this.user = { _id, screenName, avatar };

      Cookies.set("iwAccessToken", this.token, cookieOptions);
      Cookies.set("iwUser", JSON.stringify(this.user), cookieOptions);
    },

    /**
     * 更新 authStore.user 以及 Cookies
     * @param {{ _id: string, screenName: string, avatar: string} } data
     */
    updateUser(data) {
      this.user = data;
      Cookies.set("iwUser", JSON.stringify(this.user), cookieOptions);
    },
    logout() {
      this.$reset();
      Cookies.remove("iwAccessToken");
      Cookies.remove("iwUser");
      this.router.push({ name: "LoginPage" });
    },
  },
});
