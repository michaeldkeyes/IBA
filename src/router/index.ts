import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: () => import("../views/HomeView.vue"),
  // },
  {
    path: "/",
    name: "CreateLeague",
    component: () => import("../views/CreateLeague.vue"),
  },
  {
    path: "/team/:teamId",
    name: "Team",
    component: () => import("../views/TeamView.vue"),
    props: true,
  },
  {
    path: "/player/:playerId",
    name: "Player",
    component: () => import("../views/PlayerView.vue"),
    props: true,
  },
  {
    path: "/schedule/:teamId",
    name: "Schedule",
    component: () => import("../views/ScheduleView.vue"),
    props: true,
  },
  {
    path: "/game/:gameId",
    name: "Game",
    component: () => import("../views/GameView.vue"),
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
