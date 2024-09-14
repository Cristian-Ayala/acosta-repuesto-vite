const routes = [
  {
    path: "/",
    component: () => import("@/Layout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "/categorias",
        component: () => import("@/views/Categorias.vue"),
      },
      {
        path: "/productos",
        name: "Productos",
        component: () => import("@/views/Productos.vue"),
      },
      {
        path: "/marcas",
        name: "Marcas",
        component: () => import("@/views/Marcas.vue"),
      },
      {
        path: "/ordenes",
        name: "Ordenes",
        component: () => import("@/views/Ordenes.vue"),
      },
      {
        path: "/estadisticas",
        name: "Estadisticas",
        component: () => import("@/views/Estadisticas.vue"),
      },
      {
        path: "/clientes",
        name: "Clientes",
        component: () => import("@/views/Clientes.vue"),
      },
      {
        path: "/preferencias",
        name: "Preferencias",
        component: () => import("@/views/PreferenciasUsuarios.vue"),
      },
      {
        path: "/users",
        name: "UsersView",
        component: () => import("@/views/UsersView.vue"),
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
        path: "/logout",
        name: "Logout",
        component: () => import("@/views/LogOut.vue"),
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
