import { createStore as createVuexStore } from 'vuex';
import categorias from './modules/categorias.js';
import productos from './modules/productos.js';
import marcas from './modules/marcas.js';
import ordenes from './modules/ordenes.js';
import usuarios from './modules/usuarios.js';

export const createStore = (app) => {
  return createVuexStore({
    modules: {
      categorias: categorias(app),
      productos: productos(app),
      marcas: marcas(app),
      ordenes: ordenes(app),
      usuarios: usuarios(app),
    },
  });
};
