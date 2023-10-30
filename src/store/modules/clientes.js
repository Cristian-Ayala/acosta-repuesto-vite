import { apolloClient } from "@/plugins/vue-apollo";
import {
  GET_CLIENTES,
  GET_CLIENT_WHERE_EMAIL_OR_DUI_IS_DUPLICATED,
} from "@/store/graphql/queries/clientes";
import {
  CREATE_UPDATE_CLIENTES,
  DELETE_CLIENTE,
} from "@/store/graphql/mutations/clientes";

export default () => ({
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async createUpdateCliente({ commit }, variables) {
      try {
        const insertMutation = {
          mutation: CREATE_UPDATE_CLIENTES,
          variables,
        };
        const res = await apolloClient.mutate(insertMutation);
        if (!res || res.errors)
          throw new Error("al crear cliente.\n", res.errors);
        if (variables.client?.id) {
          commit("common/successNotification", "Cliente editado con éxito", {
            root: true,
          });
        } else {
          commit("common/successNotification", "Cliente agregado con éxito", {
            root: true,
          });
        }
        return res.data?.insertClient;
      } catch (error) {
        if (variables.client?.id) {
          commit(
            "common/errorNotification",
            `Error al editar el cliente. ${error}`,
          );
        } else {
          commit(
            "common/errorNotification",
            `Error al crear el cliente. ${error}`,
            { root: true },
          );
        }
        window.console.error("Error in createUpdateCliente: ", error);
        return null;
      }
    },
    async getAll(store, variables) {
      try {
        const searchInfo = {
          query: GET_CLIENTES,
          fetchPolicy: "network-only",
          variables,
        };
        const result = await apolloClient.query(searchInfo);
        if (result && result.data)
          return {
            clientes: result.data.clientes,
            count: result.data.acostarep_cliente_aggregate.aggregate.count,
          };
        return { clientes: [], count: 0 };
      } catch (err) {
        window.console.error(err);
        return { clientes: [], count: 0 };
      }
    },
    async removeCliente({ commit }, variables) {
      try {
        if (!variables.id) throw new Error("No existe ID.");
        const deleteMutation = {
          mutation: DELETE_CLIENTE,
          variables,
        };
        const res = await apolloClient.mutate(deleteMutation);
        if (!res || res.errors)
          throw new Error("al eliminar al cliente.\n", res.errors);
        commit("common/successNotification", "Cliente eliminado con éxito", {
          root: true,
        });
        return res.data?.deleteCliente;
      } catch (error) {
        commit(
          "common/errorNotification",
          `Error al eliminar el cliente. ${error}`,
          { root: true },
        );
        return null;
      }
    },
    async clientHasDupDuiOrEmail({ commit }, variables) {
      try {
        const searchInfo = {
          query: GET_CLIENT_WHERE_EMAIL_OR_DUI_IS_DUPLICATED,
          fetchPolicy: "network-only",
          variables,
        };
        const result = await apolloClient.query(searchInfo);
        if (!result || result.errors) throw new Error(result.errors);
        const [duplicatedDui] = result.data.duplicatedDui;
        const [duplicatedEmail] = result.data.duplicatedEmail;

        if (duplicatedDui) {
          commit(
            "common/errorNotification",
            `DUI duplicado en cliente:
            nombre:${duplicatedDui.name} ${duplicatedDui.last_name};
            dui: ${duplicatedDui.dui}`,
            { root: true },
          );
        }
        if (duplicatedEmail) {
          commit(
            "common/errorNotification",
            `E-mail duplicado en cliente:
            nombre: ${duplicatedEmail.name} ${duplicatedEmail.last_name},
            email: ${duplicatedEmail.email}`,
            { root: true },
          );
        }
        if (duplicatedDui || duplicatedEmail) return true;
        return false;
      } catch (err) {
        window.console.error("clientHasNoDupDuiOrEmail", err);
        commit(
          "common/errorNotification",
          `Error al buscar DUI o Email duplicados. ${err}`,
          { root: true },
        );
        return true;
      }
    },
  },
});
