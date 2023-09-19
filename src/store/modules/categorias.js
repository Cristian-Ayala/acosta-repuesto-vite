import { apolloClient } from "@/plugins/vue-apollo";
import { GET_CATEGORIAS } from "@/store/graphql/queries/categorias";
import {
  CREATE_UPDATE_CATEGORIA,
  // DELETE_CATEGORIA,
} from "@/store/graphql/mutations/categorias";

export default () => ({
  namespaced: true,
  state: {
    categorias: [],
    categoriasCount: 0,
    categoria: {
      nombreCategoria: "",
      descripcion: "",
    },
    catSelected: {},
    localCategorias: null,
  },
  mutations: {},
  actions: {
    async createUpdateRegistro({ commit, dispatch }, variables) {
      try {
        if (variables.marca.nombre_marca === "")
          throw new Error(
            "Por favor, introduce un nombre para la marca. (DO NOT REPORT THIS ERROR)",
          );
        const insertMutation = {
          mutation: CREATE_UPDATE_CATEGORIA,
          variables,
        };
        const res = await apolloClient.mutate(insertMutation);
        if (!res || res.error)
          throw new Error("al crear la marca.\n", res.error);
        dispatch("getAll");
        if (variables.marca.id) {
          commit("common/successNotification", "Categoria editada con éxito", { root: true });
        } else {
          commit("common/successNotification", "Categoria agregada con éxito", { root: true });
        }
        return res.data?.create_marca?.returning[0]?.id;
      } catch (error) {
        if (variables.marca.id) {
          commit("common/errorNotification", `Error al editar la marca. ${error}`, { root: true });
        } else if (error.message.includes("introduce un nombre")) {
          commit(
            "common/errorNotification",
            "Por favor, introduce un nombre para la marca"
            , { root: true }
          );
        } else {
          commit("common/errorNotification", `Error al crear la marca. ${error}`, { root: true });
        }
        window.console.log("Error in createRegistro (Marcas):", error);
        return null;
      }
    },
    async getCategorias({ state, commit }, variables) {
      try {
        const searchInfo = {
          query: GET_CATEGORIAS,
          fetchPolicy: "network-only",
          variables,
        };
        const result = await apolloClient.query(searchInfo);
        if (result && result.data) {
          state.categorias = result.data.categorias;
          state.categoriasCount = result.data.totalRows.aggregate.count;
        }
      } catch (err) {
        window.console.error(err);
        commit("common/errorNotification", `Error al listar categorias. ${err}`, { root: true });
      }
    },
    edithRegistro({ state, commit, dispatch }) {
      const catDoc = state.catSelected.doc;
      catDoc.nombreCategoria = catDoc.nombreCategoria.trim().toLocaleUpperCase();
      if (catDoc.nombreCategoria === "") return;
      state.localCategorias
        .put(catDoc)
        .then(() => {
          dispatch("getAllCategorias").then(() =>
            commit("common/successNotification", "Categoria editada con éxito", { root: true }),
          );
        })
        .catch((err) => {
          commit("common/errorNotification", `Error al editar la categoria. ${  err}`, { root: true });
        });
    },
    /**
       * Elimina un registro
       * @returns nada we :v,¿esperabas algo?
       */
    removeRegistro({ state, commit, dispatch }) {
      // state.categoria.doc._deleted = true;
      state.localCategorias
        .put(state.categoria.doc)
        .then(() => {
          dispatch("getAllCategorias");
          commit("common/successNotification", "Categoria eliminada con éxito", { root: true });
        })
        .catch((err) => {
          commit("common/errorNotification", `Error al eliminar la categoria. ${  err}`, { root: true });
        });
    },
  },
});
