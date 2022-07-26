import { validObjectId } from "src/utility/validator";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/:userId",
        name: "PersonalPage",
        component: () => import("pages/PersonalPage/PersonalPage.vue"),
        meta: { auth: true },
        beforeEnter: (to, from) => {
          if (!validObjectId(to.params.userId)) return { name: "NotFoundPage" };
        },
      },
      {
        path: "/",
        name: "HomePage",
        component: () => import("src/pages/HomePage.vue"),
        meta: { auth: true },
      },
      {
        path: "/account/edit",
        name: "AccountPage",
        component: () => import("pages/AccountPage/AccountPage.vue"),
        meta: { auth: true },
      },
    ],
  },
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/signup",
    name: "SignupPage",
    component: () => import("pages/SignupPage.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    name: "NotFoundPage",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
