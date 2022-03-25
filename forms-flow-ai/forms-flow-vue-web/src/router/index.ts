import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import FormView from "@/views/FormView.vue";
import Intakes from "@/views/Intakes.vue";
import Issues from "@/views/Issues.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/intakes/:taskId?",
    name: "Intakes",
    alias: ["", "/"],
    component: Intakes,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/issues/:taskId?",
    name: "Issues",
    component: Issues,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/form/:formId/submission/:submissionId",
    name: "Formio view forms",
    component: FormView,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
