const routes = [{
    path: '/',
    component: () => import('../Layout.vue'),
    children: [{
        path: '',
        name: 'home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: '/categorias',
        component: () => import('../views/Categorias.vue')
      },
      {
        path: '/productos',
        name: 'Productos',
        component: () => import('../views/Productos.vue')
      },
      {
        path: '/marcas',
        name: 'Marcas',
        component: () => import('../views/Marcas.vue')
      },
      {
        path: '/ordenes',
        name: 'Ordenes',
        component: () => import('../views/Ordenes.vue')
      },
      {
        path: '/actualizar',
        name: 'Actualizar',
        component: () => import('../views/Actualizar.vue')
      },
      {
        path: '/usuarios',
        name: 'Usuarios',
        component: () => import('../views/Usuarios.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../Layout.vue'),
    children: [{
        path: '/',
        name: 'Login',
        component: () => import('../views/Login.vue')
      },
      {
        path: '/cookies',
        name: 'Cookies',
        component: () => import('../views/Cookies.vue')
      }
    ]
  }
]

export default routes