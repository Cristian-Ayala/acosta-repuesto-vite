import { apolloClient } from "@/plugins/vue-apollo";
import { GET_CATEGORIAS, GET_MARCAS_BY_KEYWORD } from "@/store/graphql/queries/categorias";
import {
  CREATE_UPDATE_CATEGORIA,
  DELETE_CATEGORIA,
} from "@/store/graphql/mutations/categorias";

export default () => ({
  namespaced: true,
  state: {
    categorias: [],
    categoriasCount: 0,
    loadingTableCategoria: false,
    variables: {},
  },
  mutations: {},
  actions: {
    async createCategory({ commit, dispatch }, variables) {
      try {
        const insertMutation = {
          mutation: CREATE_UPDATE_CATEGORIA,
          variables,
        };
        const res = await apolloClient.mutate(insertMutation);
        if (!res || res.errors)
          throw new Error("al crear la categoria.\n", res.errors);
        dispatch("getCategorias");
        commit("common/successNotification", "Categoria agregada con éxito", {
          root: true,
        });
        return res.data?.insert_acostarep_categorias?.affected_rows;
      } catch (error) {
        commit(
          "common/errorNotification",
          `Error al crear la marca. ${error}`,
          { root: true },
        );
        window.console.error("Error in createRegistro (Categorias):", error);
        return null;
      }
    },
    async getCategorias({ state, commit }, variables) {
      try {
        if (variables != null && Object.keys(variables).length > 0) state.variables = variables;
        state.loadingTableCategoria = true;
        const searchInfo = {
          query: GET_CATEGORIAS,
          fetchPolicy: "network-only",
          variables: state.variables,
        };
        const result = await apolloClient.query(searchInfo);
        if (result && result.data) {
          state.categorias = result.data.categorias;
          state.categoriasCount = result.data.totalRows.aggregate.count;
        }
        state.loadingTableCategoria = false;
      } catch (err) {
        window.console.error(err);
        commit(
          "common/errorNotification",
          `Error al listar categorias. ${err}`,
          { root: true },
        );
        state.loadingTableCategoria = false;
      }
    },
    async editCategory({ commit, dispatch }, variables) {
      try {
        const insertMutation = {
          mutation: CREATE_UPDATE_CATEGORIA,
          variables,
        };
        const res = await apolloClient.mutate(insertMutation);
        if (!res || res.errors)
          throw new Error("al editar la categoria.\n", res.errors);
        dispatch("getCategorias");
        commit("common/successNotification", "Categoria editada con éxito", {
          root: true,
        });
        return res.data?.insert_acostarep_categorias?.affected_rows;
      } catch (error) {
        commit(
          "common/errorNotification",
          `Error al editar la categoria. ${error}`,
          { root: true },
        );
        window.console.error("Error in editRegistro (Categorias):", error);
        return null;
      }
    },
    async removeCategoria({ commit, dispatch }, variables) {
      try {
        const insertMutation = {
          mutation: DELETE_CATEGORIA,
          variables,
        };
        const res = await apolloClient.mutate(insertMutation);
        if (!res || res.errors)
          throw new Error("al eliminar la categoria.\n", res.errors);
        dispatch("getCategorias");
        commit("common/successNotification", "Categoria eliminada con éxito", {
          root: true,
        });
        return res;
        // return res.data?.deleteCategoria?.id;
      } catch (error) {
        commit(
          "common/errorNotification",
          `Error al eliminar la categoria. ${error}`,
          { root: true },
        );
        window.console.error("Error in removeCategoria (Categorias):", error);
        return null;
      }
    },
    async getCategoriasByKeyword({ commit }, variables) {
      try {
        const searchInfo = {
          query: GET_MARCAS_BY_KEYWORD,
          fetchPolicy: "network-only",
          variables,
        };
        const result = await apolloClient.query(searchInfo);
        if (result && result.data) {
          return result.data.categorias;
        }
        return [];
      } catch (err) {
        window.console.error(err);
        commit(
          "common/errorNotification",
          `Error al buscar categorias por nombre. ${err}`,
          { root: true },
        );
        return [];
      }
    },
  },
});
