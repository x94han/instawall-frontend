import { defineStore } from "pinia";
import { useQuasar } from "quasar";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    $q: useQuasar(),
    $validator: validator,
  }),
  getters: {},
  actions: {},
});
