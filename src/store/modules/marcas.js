import { apolloClient } from "@/plugins/vue-apollo";
import { GET_MARCAS } from "@/store/graphql/queries/marcas";
import {
  CREATE_UPDATE_MARCA,
  DELETE_MARCA,
} from "@/store/graphql/mutations/marcas";

export default () => ({
  namespaced: true,
  state: {
    marcas: [],
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
          mutation: CREATE_UPDATE_MARCA,
          variables,
        };
        const res = await apolloClient.mutate(insertMutation);
        if (!res || res.errors)
          throw new Error("al crear la marca.\n", res.errors);
        dispatch("getAll");
        if (variables.marca.id) {
          commit("common/successNotification", "Marca editada con éxito", {
            root: true,
          });
        } else {
          commit("common/successNotification", "Marca agregada con éxito", {
            root: true,
          });
        }
        return res.data?.create_marca?.returning[0]?.id;
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
    async getAll({ state }, variables) {
      try {
        const searchInfo = {
          query: GET_MARCAS,
          fetchPolicy: "network-only",
          variables,
        };
        const result = await apolloClient.query(searchInfo);
        if (result && result.data) {
          state.marcas = result.data.marcas;
        }
      } catch (err) {
        window.console.error(err);
      }
    },
    async removeRegistro({ commit, dispatch }, variables) {
      try {
        if (!variables.id) throw new Error("No existe ID de la marca.");
        const deleteMutation = {
          mutation: DELETE_MARCA,
          variables,
        };
        const res = await apolloClient.mutate(deleteMutation);
        if (!res || res.errors)
          throw new Error("al eliminar la marca.\n", res.errors);
        dispatch("getAll");
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
  },
});
