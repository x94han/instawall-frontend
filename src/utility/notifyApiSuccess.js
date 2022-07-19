import { Notify } from "quasar";

export default (message) => {
  Notify.create({
    type: "positive",
    position: "top",
    message: message,
    icon: "report_problem",
  });
};
