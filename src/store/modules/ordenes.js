import { apolloClient } from "@/plugins/vue-apollo";
import {
  GET_ORDENES,
  GET_DETALLE_ORDEN,
  GET_TYPES,
} from "@/store/graphql/queries/ordenes";
import {
  CREATE_ORDER,
  CREATE_PRODUCT_BY_ORDER,
  UPDATE_STATUS_ORDER,
} from "@/store/graphql/mutations/ordenes";

function dateFilterSelector(dates = {}) {
  const selector = {};
  let start = new Date();
  let end = new Date();
  if (dates.start) start = new Date(dates.start);
  if (dates.end) end = new Date(dates.end);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  selector.dateFrom = start.toISOString();
  selector.dateTo = end.toISOString();
  return selector;
}

function priceFilterSelector(price = {}) {
  const selector = {
    totalGte: null,
    totalLte: null,
  };
  if (!price.priceGte && !price.priceLte) return selector;
  selector.totalGte = !price.priceGte ? null : price.priceGte;
  selector.totalLte = !price.priceLte ? null : price.priceLte;
  return selector;
}

export default () => ({
  namespaced: true,
  state: {
    ordenes: [],
    ordenesCount: 0,
    enums: {},
    tipoDistribucionArray: [],
    dropDownTypeOfOrder: [],
    dropdownStatus: [],
    dropDownMetodoPago: [],
    variables: null,
  },
  mutations: {
    formatDate(date) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? "pm" : "am";
      hours %= 12;
      hours = hours || 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      const strTime = `${hours}:${minutes} ${ampm}`;
      return `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()} ${strTime}`;
    },
    dosDecimalesProd(precio) {
      try {
        return precio.toFixed(2);
      } catch (error) {
        return precio;
      }
    },
    /* eslint-disable  prefer-destructuring */
    SET_DIST_TYPE(state, types) {
      state.tipoDistribucionArray = types;
      state.enums.DIST_TYPE = {};
      state.enums.DIST_TYPE.PUBLICO = types[0];
      state.enums.DIST_TYPE.MAYOREO = types[1];
      state.enums.DIST_TYPE.TALLER = types[2];
    },
    SET_PAYMENT_MET(state, methods) {
      state.dropDownMetodoPago = methods;
      state.enums.PAY_METHOD = {};
      state.enums.PAY_METHOD.TDC = methods[0];
      state.enums.PAY_METHOD.TDD = methods[1];
      state.enums.PAY_METHOD.EFECTIVO = methods[2];
      state.enums.PAY_METHOD.CREDITO_FISCAL = methods[3];
      state.enums.PAY_METHOD.CRYPTO = methods[4];
    },
    SET_ORDER_TYPE(state, types) {
      state.dropDownTypeOfOrder = types;
      state.enums.ORD_TYPE = {};
      state.enums.ORD_TYPE.LOCAL = types[0];
      state.enums.ORD_TYPE.DELIVERY = types[1];
    },
    SET_ORDER_STATUS(state, types) {
      state.dropdownStatus = types;
      state.enums.ORD_STATUS = {};
      state.enums.ORD_STATUS.EN_PROCESO = types[0];
      state.enums.ORD_STATUS.EN_CAMINO = types[1];
      state.enums.ORD_STATUS.COMPLETADO = types[2];
    },
    /* eslint-enable  prefer-destructuring */
  },
  actions: {
    async createRegistroOrdenes({ commit, dispatch }, { order, prodByOrder }) {
      try {
        const insertMutation = {
          mutation: CREATE_ORDER,
          variables: {
            order,
          },
        };
        const res = await apolloClient.mutate(insertMutation);
        if (!res || res.errors)
          throw new Error("al crear la orden.\n", res.errors);
        const resProdByOrder = await dispatch("createProdByOrder", {
          prodByOrder,
          idOrden: res.data.insertOrder.id,
        });
        commit("common/successNotification", "Orden agregada con éxito", {
          root: true,
        });
        if (!resProdByOrder) {
          // TODO: Eliminar orden
          throw new Error(
            "No se pudo crear la orden porque no se pudieron agregar los productos.\n",
            res.errors,
          );
        }
        commit("productos/CLEAR_CART", null, { root: true });
        return res.data?.insertOrder?.id;
      } catch (error) {
        let returnValue = null;
        if (error.message.includes("JWTExpired")) {
          localStorage.setItem("order", JSON.stringify(order));
          localStorage.setItem("prodByOrder", JSON.stringify(prodByOrder));
          error.message = "Su sesión ha expirado, por favor vuelva a iniciar sesión.";
          returnValue = "JWTExpired";
        }
        commit(
          "common/errorNotification",
          `Error al guardar la orden. ${error}`,
          { root: true },
        );
        window.console.error("Error in createRegistroOrdenes:", error);
        return returnValue;
      }
    },
    async createProdByOrder(store, { prodByOrder, idOrden }) {
      try {
        const insertMutation = {
          mutation: CREATE_PRODUCT_BY_ORDER,
          variables: {
            prodByOrder: prodByOrder.map((prod) => ({
              id_orden: idOrden,
              id_producto: prod.id,
              sub_total: prod.subtotal,
              cantidad: prod.cantidad,
              precio: prod.price,
              stock: prod.stock,
            })),
          },
        };
        const res = await apolloClient.mutate(insertMutation);
        if (!res || res.errors)
          throw new Error("al crear productos por orden.\n", res.errors);
        return res.data?.insert_acostarep_productos_orden?.returning;
      } catch (error) {
        window.console.error("Error in createProdByOrder:", error);
        return null;
      }
    },
    async readAllOrdenes({ state, commit, rootState }, filters) {
      try {
        if (filters != null && Object.keys(filters).length > 0) {
          const sucursales = rootState.auth.userProfile?.sucursal;
          state.variables = {
            limit: filters.limit || null,
            offset: filters.offset || null,
            createdBy: rootState.auth.userProfile?.id,
            cedes: sucursales,
            orderTypeID: filters.orderTypeID,
            distributionTypeID: filters.distributionTypeID,
            statusID: filters.statusID,
            ...priceFilterSelector(filters.price),
            ...dateFilterSelector(filters.date),
          };
        }
        const searchInfo = {
          query: GET_ORDENES,
          fetchPolicy: "network-only",
          variables: state.variables,
        };
        const result = await apolloClient.query(searchInfo);
        if (result && result.data) {
          state.ordenes = result.data.ordenes;
          state.ordenesCount = result.data.totalOrdenes.aggregate.count;
        }
      } catch (err) {
        window.console.error(err);
        commit("common/errorNotification", `Error al listar ordenes. ${err}`, {
          root: true,
        });
      }
    },
    async GET_DETALLE_ORDEN({ commit }, variables) {
      try {
        const searchInfo = {
          query: GET_DETALLE_ORDEN,
          variables,
        };
        const result = await apolloClient.query(searchInfo);
        if (result && result.data) {
          return result.data.detOrden;
        }
        return [];
      } catch (err) {
        window.console.error(err);
        commit(
          "common/errorNotification",
          `Error al obtener detalle de la orden. ${err}`,
          {
            root: true,
          },
        );
        return [];
      }
    },
    async GET_TYPES({ commit }) {
      try {
        const searchInfo = {
          query: GET_TYPES,
        };
        const result = await apolloClient.query(searchInfo);
        if (result && result.data) {
          commit("SET_DIST_TYPE", result.data.distType);
          commit("SET_PAYMENT_MET", result.data.metPago);
          commit("SET_ORDER_TYPE", result.data.ordType);
          commit("SET_ORDER_STATUS", result.data.ordStatus);
        }
      } catch (err) {
        window.console.error(err);
        commit(
          "common/errorNotification",
          `Vuelva a cargar la página o no servirá apropiadamente. Error al obtener tipos de datos. ${err}`,
          {
            root: true,
          },
        );
      }
    },
    async changeDeliveryStatus({ commit }, variables) {
      try {
        const insertMutation = {
          mutation: UPDATE_STATUS_ORDER,
          variables,
        };
        const res = await apolloClient.mutate(insertMutation);
        if (!res || res.errors)
          throw new Error("al cambiar estado de la orden.\n", res.errors);
        commit("common/successNotification", "Estado de orden actualizado.", {
          root: true,
        });
        return res.data?.updateStatusOrder;
      } catch (error) {
        window.console.error("Error in changeDeliveryStatus:", error);
        return null;
      }
    },
  },
});
