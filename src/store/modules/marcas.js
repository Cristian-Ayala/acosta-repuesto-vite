import { apolloClient } from "@/plugins/vue-apollo";
import { GET_MARCAS, GET_MARCAS_BY_ID } from "@/store/graphql/queries/marcas";
import {
  CREATE_UPDATE_MARCA,
  DELETE_MARCA,
} from "@/store/graphql/mutations/marcas";

export default () => ({
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async createUpdateRegistro({ commit }, variables) {
      try {
        if (variables.marca.nombre_marca === "")
          throw new Error(
            "Por favor, introduce un nombre para la marca. (DO NOT REPORT THIS ERROR)",
          );
        const insertMutation = {
          mutation: CREATE_UPDATE_MARCA,
          variables,
        };
        const res = await apolloClient.mutate(insertMutation);
        if (!res || res.errors)
          throw new Error("al crear la marca.\n", res.errors);
        if (variables.marca.id) {
          commit("common/successNotification", "Marca editada con éxito", {
            root: true,
          });
        } else {
          commit("common/successNotification", "Marca agregada con éxito", {
            root: true,
          });
        }
        return res.data?.create_marca?.returning[0];
      } catch (error) {
        if (variables.marca.id) {
          commit(
            "common/errorNotification",
            `Error al editar la marca. ${error}`,
          );
        } else if (error.message.includes("introduce un nombre")) {
          commit(
            "common/errorNotification",
            "Por favor, introduce un nombre para la marca",
            { root: true },
          );
        } else {
          commit(
            "common/errorNotification",
            `Error al crear la marca. ${error}`,
            { root: true },
          );
        }
        window.console.error("Error in createRegistro (Marcas):", error);
        return null;
      }
    },
    async getAll(store, variables) {
      try {
        const searchInfo = {
          query: GET_MARCAS,
          fetchPolicy: "network-only",
          variables,
        };
        const result = await apolloClient.query(searchInfo);
        if (result && result.data) return result.data.marcas;
        return [];
      } catch (err) {
        window.console.error(err);
        return [];
      }
    },
    async removeRegistro({ commit }, variables) {
      try {
        if (!variables.id) throw new Error("No existe ID de la marca.");
        const deleteMutation = {
          mutation: DELETE_MARCA,
          variables,
        };
        const res = await apolloClient.mutate(deleteMutation);
        if (!res || res.errors)
          throw new Error("al eliminar la marca.\n", res.errors);
        commit("common/successNotification", "Marca eliminada con éxito", {
          root: true,
        });
        return res.data?.create_marca?.returning[0]?.id;
      } catch (error) {
        commit(
          "common/errorNotification",
          `Error al eliminar la marca. ${error}`,
          { root: true },
        );
        return null;
      }
    },
    async GET_MARCA_BY_ID(store, variables) {
      try {
        const searchInfo = {
          query: GET_MARCAS_BY_ID,
          fetchPolicy: "network-only",
          variables,
        };
        const result = await apolloClient.query(searchInfo);
        if (result && result.data) return result.data.marcas;
        return [];
      } catch (err) {
        window.console.error(err);
        return [];
      }
    },
  },
});
