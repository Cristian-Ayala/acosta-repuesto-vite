import { apolloClient } from "@/plugins/vue-apollo";
import {
  GET_STATISTICS,
  GET_USERS,
} from "@/store/graphql/queries/estadisticas";

const isLoggedIn = () => false;

const rejectPromise = (message) =>
  new Promise((resolve, reject) => {
    reject(new Error(message));
  });
export default (app) => ({
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    getStatistics({ dispatch, rootState }, searchParameters) {
      if (!isLoggedIn()) return rejectPromise("No está logueado");
      const settings = {
        method: "GET",
        credentials: "include",
      };
      const role = rootState.auth.userProfile.defaultRole;
      if (searchParameters.userSelected === "Todos" && role === "manager")
        return dispatch("getStatisticsByOrgDiv", {
          searchParameters,
          settings,
        });
      if (searchParameters.typeOfFilter === "Por cede")
        return dispatch("getStatisticsByOrgDiv", {
          searchParameters,
          settings,
        });
      return dispatch("getStatisticsByUser", { searchParameters, settings });
    },
    async GET_STATISTICS({ commit }, variables) {
      try {
        const searchInfo = {
          query: GET_STATISTICS,
          fetchPolicy: "network-only",
          variables,
        };
        const res = await apolloClient.query(searchInfo);
        if (!res || res.errors)
          throw new Error("al obtener estadísticas.\n", res.errors);
        return {
          numeroOrdenes: res.data.numeroOrdenes.aggregate.count,
          maxTotal: res.data.maxTotal.aggregate.max.total_orden,
          minTotal: res.data.minTotal.aggregate.min.total_orden,
          totalOrdenes: res.data.totalOrdenes.aggregate.sum.total_orden,
        };
      } catch (err) {
        window.console.error(err);
        commit(
          "common/errorNotification",
          `Error al obtener detalle de la orden. ${err}`,
          {
            root: true,
          },
        );
        return null;
      }
    },
    async GET_USERS({ commit }, variables) {
      try {
        const searchInfo = {
          query: GET_USERS,
          variables,
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
    getStatisticsByUser(store, { searchParameters, settings }) {
      return fetch(
        `${
          app.config.globalProperties.$url
        }ordenes/_design/estadisticasVenta/_view/estadisticasVentaByUser?startkey=[${
          searchParameters.userSelected !== "Todos"
            ? `"${searchParameters.userSelected}",`
            : ""
        }${searchParameters.startkey}]&endkey=[${
          searchParameters.userSelected !== "Todos"
            ? `"${searchParameters.userSelected}"`
            : JSON.stringify({})
        },${searchParameters.endkey}]`,
        settings,
      ).then((response) => response.json());
    },
    getStatisticsByOrgDiv({ rootState }, { searchParameters, settings }) {
      let orgDivision = null;
      if (searchParameters.orgDivSelected != null)
        orgDivision = searchParameters.orgDivSelected;
      else orgDivision = rootState.auth.userProfile.locationSelected;
      return fetch(
        `${app.config.globalProperties.$url}ordenes/_design/estadisticasVenta/_view/ordersByOrgDiv?startkey=["${orgDivision}",${searchParameters.startkey}]&endkey=["${orgDivision}",${searchParameters.endkey}]`,
        settings,
      ).then((response) => response.json());
    },
  },
});
