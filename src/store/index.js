import { createStore as createVuexStore } from "vuex";
import common from "./modules/common";
import categorias from "./modules/categorias";
import productos from "./modules/productos";
import marcas from "./modules/marcas";
import ordenes from "./modules/ordenes";
import estadisticas from "./modules/estadisticas";
import clientes from "./modules/clientes";

// eslint-disable-next-line import/prefer-default-export
export const createStore = (app) => createVuexStore({
  modules: {
    common: common(app),
    categorias: categorias(app),
    productos: productos(app),
    marcas: marcas(app),
    ordenes: ordenes(app),
    estadisticas: estadisticas(app),
    clientes: clientes(app),
  },
});
