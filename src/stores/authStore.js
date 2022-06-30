import { defineStore } from "pinia";
import { apiLogin } from "src/apis";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("iwAccessToken"),
    user: JSON.parse(localStorage.getItem("iwUser")),
    tokenEexpiredAt: localStorage.getItem("iwAccessTokenEexpiredAt"),
  }),
  getters: {
    validToken() {
      const expiredAt = new Date(this.tokenEexpiredAt * 1);
      return this.token !== null && expiredAt > new Date();
    },
  },
  actions: {
    async login(param) {
      const res = await apiLogin(param);
      const { _id, screenName, avatar } = res.data;

      this.token = res.token;
      this.user = { _id, screenName, avatar };

      const now = new Date();
      const tomorrow = now.setDate(now.getDate() + 1);
      this.tokenEexpiredAt = tomorrow;

      localStorage.setItem("iwAccessToken", this.token);
      localStorage.setItem("iwUser", JSON.stringify(this.user));
      localStorage.setItem("iwAccessTokenEexpiredAt", tomorrow);
    },
    logout() {
      localStorage.removeItem("iwAccessToken");
      localStorage.removeItem("iwUser");
      localStorage.removeItem("iwAccessTokenEexpiredAt");
      this.$reset();
    },
  },
});
