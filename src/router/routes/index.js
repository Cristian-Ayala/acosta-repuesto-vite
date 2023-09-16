import { authGuard } from "@auth0/auth0-vue";

const routes = [
  {
    path: "/",
    component: () => import("@/Layout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/Home.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/categorias",
        component: () => import("@/views/Categorias.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/productos",
        name: "Productos",
        component: () => import("@/views/Productos.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/marcas",
        name: "Marcas",
        component: () => import("@/views/Marcas.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/ordenes",
        name: "Ordenes",
        component: () => import("@/views/Ordenes.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/estadisticas",
        name: "Estadisticas",
        component: () => import("@/views/Estadisticas.vue"),
        beforeEnter: authGuard,
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/Layout.vue"),
    children: [
      {
        path: "/",
        name: "Login",
        component: () => import("@/views/Login.vue"),
        meta: {
          allowAnonymous: true,
          layout: "Blank",
        },
      },
      {
        path: "/cookies",
        name: "Cookies",
        component: () => import("@/views/Cookies.vue"),
        meta: {
          allowAnonymous: true,
          layout: "Blank",
        },
      },
    ],
  },
];

export default routes;
