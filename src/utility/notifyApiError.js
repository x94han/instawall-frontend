import { Notify } from "quasar";

export default (error) => {
  Notify.create({
    color: "negative",
    position: "top",
    message: "系統錯誤，請洽系統管理員！",
  });
};
