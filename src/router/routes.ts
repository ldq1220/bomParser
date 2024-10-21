//对外暴露配置路由(常量路由):全部用户都可以访问到的路由
export const constantRoute = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/bomParser/index.vue"),
  },
  {
    path: "/hjsCrm",
    name: "hjsCrm",
    component: () => import("@/views/hjsCrm/index.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404/index.vue"),
  },
  {
    //任意路由
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    name: "Any",
    meta: {
      title: "任意路由",
      hidden: true,
      icon: "DataLine",
    },
  },
];

export const asnycRoute: any = [];
