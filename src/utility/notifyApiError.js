import { Notify } from "quasar";

export default (error) => {
  Notify.create({
    color: "warning",
    textColor: "dark",
    position: "top",
    message: error.message,
    icon: "report_problem",
  });
};
