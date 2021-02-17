import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/team/:teamId",
    name: "Team",
    component: () => import("../views/Team.vue"),
    props: true,
  },
  {
    path: "/player/:playerId",
    name: "Player",
    component: () => import("../views/Player.vue"),
    props: true,
  },
  {
    path: "/schedule/:teamId",
    name: "Schedule",
    component: () => import("../views/Schedule.vue"),
    props: true,
  },
  {
    path: "/game/:gameId",
    name: "Game",
    component: () => import("../views/Game.vue"),
    props: true,
  },
  {
    path: "/:catchAll(.*)",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
