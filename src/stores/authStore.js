import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    tokenEexpiredAt: null,
    user: null,
  }),
  getters: {
    validToken() {
      const token = sessionStorage.getItem("iwAccessToken");
      const expiredAt = sessionStorage.getItem("iwAccessTokenEexpiredAt");
      return token !== null && expiredAt <= new Date();
    },
  },
  actions: {
    setTokenInfo(token) {
      const now = new Date();
      const tomorrowMS = now.setDate(now.getDate() + 1);
      const tomorrow = new Date(tomorrowMS);

      sessionStorage.setItem("iwAccessToken", token);
      this.token = token;

      sessionStorage.setItem("iwAccessTokenEexpiredAt", tomorrow);
      this.tokenEexpiredAt = tomorrow;
    },
  },
});
