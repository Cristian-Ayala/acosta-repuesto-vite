import { ElMessage } from "element-plus";
import PouchDB from "pouchdb-browser";
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
    marcasCount: 0,
    marca: {
      nombreMarca: "",
      descripMarca: "",
    },
    marSelected: {},
    localMarca: null,
    PouchDB,
  },
  mutations: {
    clearData(state) {
      state.marca = {
        nombreMarca: "",
        descripMarca: "",
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
        type: "error",
      });
    },
    successNotification(state, message) {
      ElMessage({
        showClose: true,
        message,
        type: "success",
      });
    },
  },
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
        if (!res || res.error)
          throw new Error("al crear la marca.\n", res.error);
        dispatch("getAll");
        if (variables.marca.id) {
          commit("successNotification", "Marca editada con éxito");
        } else {
          commit("successNotification", "Marca agregada con éxito");
        }
        return res.data?.create_marca?.returning[0]?.id;
      } catch (error) {
        if (variables.marca.id) {
          commit("errorNotification", `Error al editar la marca. ${error}`);
        } else if (error.message.includes("introduce un nombre")) {
          commit(
            "errorNotification",
            "Por favor, introduce un nombre para la marca",
          );
        } else {
          commit("errorNotification", `Error al crear la marca. ${error}`);
        }
        window.console.log("Error in createRegistro (Marcas):", error);
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
          state.marcasCount = result.data.totalRows.aggregate.count;
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
        if (!res || res.error)
          throw new Error("al eliminar la marca.\n", res.error);
        dispatch("getAll");
        commit("successNotification", "Marca eliminada con éxito");
        return res.data?.create_marca?.returning[0]?.id;
      } catch (error) {
        commit("errorNotification", `Error al eliminar la marca. ${error}`);
        return null;
      }
    },
  },
});
