import { apolloClient } from "@/plugins/vue-apollo";
import { UPDATE_USER } from "@/store/graphql/mutations/users";
import { GET_USERS } from "@/store/graphql/queries/users";

export default () => ({
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async GET_USERS({ commit, rootState }) {
      try {
        if (!rootState.auth.userProfile)
          throw new Error("No hay un usuario logueado.");
        let constains = null;
        if (rootState.auth.userProfile.roles.includes("admin"))
          constains = ["gerente_area", "seller"];
        else if (rootState.auth.userProfile.roles.includes("gerente_area"))
          constains = ["seller"];

        if (!constains)
          throw new Error("No tienes permisos para ver usuarios.");

        const searchInfo = {
          query: GET_USERS,
          fetchPolicy: "network-only",
          variables: {
            _contains: constains,
          },
        };
        const res = await apolloClient.query(searchInfo);
        if (!res || res.errors)
          throw new Error("al obtener usuarios.\n", res.errors);
        return res.data.users;
      } catch (err) {
        window.console.error(err);
        commit(
          "common/errorNotification",
          `Error al obtener usuarios. ${err}`,
          {
            root: true,
          },
        );
        return null;
      }
    },
    async updateUsr({ commit }, usr) {
      try {
        const insertMutation = {
          mutation: UPDATE_USER,
          variables: {
            id: usr.id,
            usr: {
              active: usr.active,
              email: usr.email,
              name: usr.name,
              roles: usr.roles,
              sucursal: usr.sucursal,
            },
          },
        };
        const res = await apolloClient.mutate(insertMutation);
        if (!res || res.errors)
          throw new Error("al editar usuario.\n", res.errors);
        commit("common/successNotification", "Usuario editado con éxito", {
          root: true,
        });
        return res.data;
      } catch (error) {
        commit(
          "common/errorNotification",
          `Error al editar usuario. ${error}`,
          { root: true },
        );
        window.console.error("Error in updateUsr (users):", error);
        return null;
      }
    },
  },
});
