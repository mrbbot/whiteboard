import Vue from "vue";
import VueRouter from "vue-router";
import Board from "./Board";
import shortid from "shortid";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "redirect",
    component: Board
  },
  {
    path: "/:id",
    name: "board",
    component: Board
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (!to.params.id) {
    next({
      name: "board",
      params: {
        id: shortid()
      },
      query: to.query
    });
  } else {
    next();
  }
});

export default router;
