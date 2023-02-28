// import { ElMessage } from "element-plus";
// import router from "../../router/index";
import isLoggedIn from "../../router/middleware/auth";

const rejectPromise = (message) => new Promise((resolve, reject) => {
  reject(new Error(message));
});
export default (app) => ({
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    getStatistics({ dispatch }, searchParameters) {
      if (!isLoggedIn()) return rejectPromise("No está logueado");
      const settings = {
        method: "GET",
        credentials: "include",
      };
      const role = localStorage.getItem("role");
      if (searchParameters.userSelected === "Todos" && role === "manager") return dispatch("getStatisticsByOrgDiv", { searchParameters, settings });
      if (searchParameters.typeOfFilter === "Por cede") return dispatch("getStatisticsByOrgDiv", { searchParameters, settings });
      return dispatch("getStatisticsByUser", { searchParameters, settings });
    },
    getStatisticsByUser(store, {searchParameters, settings}) {
      return fetch(`${app.config.globalProperties.$url}ordenes/_design/estadisticasVenta/_view/estadisticasVentaByUser?startkey=[${searchParameters.userSelected !== "Todos" ? `"${searchParameters.userSelected}",` : "" }${searchParameters.startkey}]&endkey=[${searchParameters.userSelected !== "Todos" ? `"${searchParameters.userSelected}"` : JSON.stringify({}) },${searchParameters.endkey}]`, settings)
        .then(response => response.json());
    },
    getStatisticsByOrgDiv(store, {searchParameters, settings}) {
      let orgDivision = null;
      if (searchParameters.orgDivSelected != null) orgDivision = searchParameters.orgDivSelected;
      else orgDivision = localStorage.getItem("org_division");
      return fetch(`${app.config.globalProperties.$url}ordenes/_design/estadisticasVenta/_view/ordersByOrgDiv?startkey=["${orgDivision}",${searchParameters.startkey}]&endkey=["${orgDivision}",${searchParameters.endkey}]`, settings)
        .then(response => response.json());
    }
  },
});
