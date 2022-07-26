import { createStore as createVuexStore } from 'vuex';
import categorias from './modules/categorias';
import productos from './modules/productos';
import marcas from './modules/marcas';
import ordenes from './modules/ordenes';
import usuarios from './modules/usuarios';

// eslint-disable-next-line import/prefer-default-export
export const createStore = (app) => createVuexStore({
    modules: {
      categorias: categorias(app),
      productos: productos(app),
      marcas: marcas(app),
      ordenes: ordenes(app),
      usuarios: usuarios(app),
    },
  });
