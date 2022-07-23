import { ElMessage } from 'element-plus';
import PouchDB from 'pouchdb-browser';
import router from '../../router/index';

export default (app) => ({
  namespaced: true,
  state: {
    marcas: [],
    marca: {
      nombreMarca: '',
      descripMarca: '',
    },
    marSelected: {},
    localMarca: null,
    PouchDB,
  },
  mutations: {
    clearData(state) {
      state.marca = {
        nombreMarca: '',
        descripMarca: '',
      };
    },
    getMarcaSelected(state, mar) {
      state.marca = mar;
      state.marSelected = JSON.parse(JSON.stringify(mar));
    },
    errorNotification(state, message) {
      ElMessage({
        showClose: true,
        message,
        type: 'error',
      });
    },
    successNotification(state, message) {
      ElMessage({
        showClose: true,
        message,
        type: 'success',
      });
    },
  },
  actions: {
    createRegistro({ state, dispatch, commit }) {
      if (state.marca.nombreMarca.trim() !== '') {
        // For puchDB we need to add an _id field
        state.marca._id = new Date().toISOString();
        state.marca.nombreMarca = state.marca.nombreMarca.trim().toLocaleUpperCase();
        state.localMarca
          .put(state.marca)
          .then(() => {
            dispatch('getAll').then(() => commit('successNotification', 'Marca agregada con éxito'));
          })
          .catch((err) => {
            commit('errorNotification', `Error al guardar la marca. ${err}`);
          });
      } else {
        commit('errorNotification', 'Por favor, introduce un nombre para la marca');
      }
    },
    getAll({ state, commit }) {
      state.localMarca
        .allDocs({
          include_docs: true,
          descending: false,
        })
        .then((doc) => {
          state.marcas = doc.rows.sort((a, b) => {
            if (a.doc.nombreMarca > b.doc.nombreMarca) return 1;
            if (b.doc.nombreMarca > a.doc.nombreMarca) return -1;
            return 0;
          });
        })
        .catch((err) => commit('errorNotification', `Error al listar la marca. ${err}`));
    },
    edithRegistro({ state, commit, dispatch }) {
      state.localMarca
        .put(state.marSelected.doc)
        .then(() => {
          dispatch('getAll').then(() => commit('successNotification', 'Marca editada con éxito'));
        })
        .catch((err) => {
          commit('errorNotification', `Error al editar la marca. ${err}`);
        });
    },
    removeRegistro({ state, commit, dispatch }) {
      state.marca.doc._deleted = true;
      state.localMarca
        .put(state.marca.doc)
        .then(() => {
          dispatch('getAll');
          commit('successNotification', 'Marca eliminada con éxito');
        })
        .catch((err) => {
          commit('errorNotification', `Error al eliminar la marca. ${err}`);
        });
    },
    initDB({ state, dispatch }) {
      const remoteMarca = new state.PouchDB(
        `${app.config.globalProperties.$url}marcas`,
        {
          fetch(url, opts) {
            return state.PouchDB.fetch(url, opts, {
              credentials: 'include',
            });
          },
        },
      );
      remoteMarca.info().catch((err) => {
        if (err.status === 401) {
          router
            .push({
              path: '/login',
            })
            .catch(() => {});
        }
      });

      state.localMarca = new state.PouchDB('marcas');
      // do one way, one-off sync from the server until completion
      state.localMarca.replicate.from(remoteMarca).on('complete', () => {
        // console.log("Se terminó la replicación");
        dispatch('getAll');
        // then two-way, continuous, retriable sync
        state.localMarca
          .sync(remoteMarca, {
            live: true,
            retry: true,
          })
          .on('change', () => {
            dispatch('getAll');
          });
      });
    },
  },
});
