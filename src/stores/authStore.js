import { defineStore } from "pinia";
import { useQuasar, date } from "quasar";
import { apiLogin } from "src/apis";

const $q = useQuasar();
const cookieOptions = {
  expires: "1d",
  httpOnly: true,
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: $q.cookies.get("iwAccessToken"),
    user: JSON.parse($q.cookies.get("iwUser")),
  }),
  getters: {
    validToken() {
      return $q.cookies.has("iwAccessToken");
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
    saveLoginData(res) {
      const { _id, screenName, avatar } = res.data.user;

      this.token = res.data.token;
      this.user = { _id, screenName, avatar };

      $q.cookies.set("iwAccessToken", this.token, cookieOptions);
      $q.cookies.set("iwUser", JSON.stringify(this.user), cookieOptions);
    },
    logout() {
      $q.cookies.remove("iwAccessToken");
      $q.cookies.remove("iwUser");
      this.$reset();
    },
  },
});
