import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../components/Home.vue"),
  },
  {
    path: "/teams",
    name: "Teams",
    component: () => import("../components/Teams.vue"),
  },
  {
    path: "/roster/:teamId",
    name: "Roster",
    component: () => import("../components/Roster.vue"),
    props: true,
  },
  {
    path: "/player/:playerId",
    name: "Player",
    component: () => import("../components/Player.vue"),
    props: true,
  },
  {
    path: "/schedule/:teamId",
    name: "Schedule",
    component: () => import("../components/Schedule.vue"),
    props: true,
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("../components/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
