import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify } from "quasar";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const baseURL = "http://localhost:3000/api/v1";
const api = axios.create({ baseURL });

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response.data;
  },
  function (error) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          console.error("你要找的頁面不存在", error);
          // go to 404 page
          break;

        default:
          console.error(error);
      }
    }

    if (!window.navigator.onLine) {
      Notify.create({
        color: "warning",
        textColor: "dark",
        position: "top",
        message: "網路出了點問題，請重新連線後重整網頁",
      });
      return;
    }

    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
