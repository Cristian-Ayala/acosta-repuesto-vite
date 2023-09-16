import { ElMessage } from "element-plus";
import PouchDB from "pouchdb-browser";
import router from "../../router/routes/index";

export default (app) => ({
  namespaced: true,
  state: {
    categorias: [],
    categoria: {
      nombreCategoria: "",
      descripcion: "",
    },
    catSelected: {},
    PouchDB,
    localCategorias: null,
  },
  mutations: {
    /**
       * limpiando valores de la categoria previamente seleccionada
       * @param {*} state
       */
    clearDataCat(state) {
      state.categoria = {
        nombreCategoria: "",
        descripcion: "",
      };
    },
    /**
       *
       * @param {*} cat
       */
    getCategoriaSelected(state, cat) {
      state.categoria = cat;
      state.catSelected = JSON.parse(JSON.stringify(cat));
    },
    successNotification(state, message) {
      ElMessage({
        showClose: true,
        message,
        type: "success",
      });
    },
    errorNotification(state, message) {
      ElMessage({
        showClose: true,
        message,
        type: "error",
      });
    },
  },
  actions: {
    /**
       * Crea registro con categoria
       * El nombre no tiene que ir vacío
       * @param {*} state
       */
    createRegistro({ state, dispatch, commit }) {
      if (state.categoria.nombreCategoria.trim() !== "") {
        // For puchDB we need to add an _id field
        state.categoria._id = new Date().toISOString();
        state.categoria.nombreCategoria = state.categoria.nombreCategoria.trim().toLocaleUpperCase();
        state.localCategorias
          .put(state.categoria)
          .then(() => {
            dispatch("getAllCategorias").then(() =>
              commit("successNotification", "Categoria agregada con éxito"),
            );
          })
          .catch((err) => {
            commit("errorNotification", `Error al guardar la categoria. ${  err}`);
          });
      } else {
        commit("errorNotification", "Por favor, introduce un nombre para la categoria.");
      }
    },
    getAllCategorias({ state, commit }) {
      state.localCategorias
        .allDocs({
          include_docs: true,
          descending: false,
        })
        .then((doc) => {
          state.categorias = doc.rows.sort((a, b) => {
            if (a.doc.nombreCategoria > b.doc.nombreCategoria) return 1
            if (b.doc.nombreCategoria > a.doc.nombreCategoria) return -1;
            return 0;
          });
        })
        .catch((err) =>
          commit("errorNotification", `Error al listar categorias. ${  err}`),
        );
    },
    edithRegistro({ state, commit, dispatch }) {
      const catDoc = state.catSelected.doc;
      catDoc.nombreCategoria = catDoc.nombreCategoria.trim().toLocaleUpperCase();
      if (catDoc.nombreCategoria === "") return;
      state.localCategorias
        .put(catDoc)
        .then(() => {
          dispatch("getAllCategorias").then(() =>
            commit("successNotification", "Categoria editada con éxito"),
          );
        })
        .catch((err) => {
          commit("errorNotification", `Error al editar la categoria. ${  err}`);
        });
    },
    /**
       * Elimina un registro
       * @returns nada we :v,¿esperabas algo?
       */
    removeRegistro({ state, commit, dispatch }) {
      state.categoria.doc._deleted = true;
      state.localCategorias
        .put(state.categoria.doc)
        .then(() => {
          dispatch("getAllCategorias");
          commit("successNotification", "Categoria eliminada con éxito");
        })
        .catch((err) => {
          commit("errorNotification", `Error al eliminar la categoria. ${  err}`);
        });
    },
    initDbCategorias({ state, dispatch }) {
      const remoteCategorias = new state.PouchDB(
        `${app.config.globalProperties.$url  }categorias`,
        {
          fetch (url, opts) {
            return state.PouchDB.fetch(url, opts, {
              credentials: "include",
            });
          },
        },
      );
      remoteCategorias.info().catch((err) => {
        if (err.status === 401) {
          router
            .push({
              path: "/login",
            })
            .catch(() => {});
        }
      });

      state.localCategorias = new state.PouchDB("categorias");
      // do one way, one-off sync from the server until completion
      state.localCategorias.replicate
        .from(remoteCategorias)
        .on("complete", () => {
          // console.log("Se terminó la replicación");
          dispatch("getAllCategorias");
          // then two-way, continuous, retriable sync
          state.localCategorias
            .sync(remoteCategorias, {
              live: true,
              retry: true,
            })
            .on("change", () => {
              dispatch("getAllCategorias");
            })
            .on("error", (err) => {
              console.log("totally unhandled error (shouldn't happen)", err);
            });
        });
    },
  },
});
