import { ElMessage } from 'element-plus';
import PouchDB from 'pouchdb-browser';
import router from '../../router/index';
import isLoggedIn from '../../router/middleware/auth';

function dateFilterSelector(dates = {}) {
  const selector = {};
  let start = new Date();
  let end = new Date();
  if (dates.start) start = new Date(dates.start);
  if (dates.end) end = new Date(dates.end);
  start.setHours(0,0,0,0);
  end.setHours(23,59,59,999);
  selector.$gte = start.toISOString();
  selector.$lte = end.toISOString();
  return selector;
}

function priceFilterSelector(price = {}) {
  if (price.priceGte === 0 && price.priceLte === 0) return {};
  const selector = { totalOrden: {} };
  selector.totalOrden.$gte = price.priceGte || 0;
  if (price.priceLte > 0) selector.totalOrden.$lte = price.priceLte;
  return selector;
}

function orderTypeFilterSelector(orderType = 'Todas') {
  if (orderType === 'Todas') return {};
  return { tipoOrden: { $eq: orderType } };
}

function distributionOrderTypeFilterSelector(distributionOrderType = 'Todas') {
  if (distributionOrderType === 'Todas') return {};
  return { tipoDistribucion: { $eq: distributionOrderType } };
}

function orderStatusFilterSelector(status = 'Todas') {
  if (status === 'Todas') return {};
  return { status: { $eq: status } };
}

export default (app) => ({
    namespaced: true,
    state: {
      ordenes: [],
      searchDisplay: '',
      ordSelected: {},
      detalleOrden: [],
      activaOrd: [],
      prodSearch: '',
      showDetOrd: false,
      delay: 700,
      clicks: 0,
      timer: null,
      currentPage: 1,
      skipPagination: 0,
      localOrdenes: null,
      PouchDB,
      defaultPageSize: 10,
      totalRows: 0,
    },
    mutations: {
      /*
        creacion de nuevos registros
        (no se pueden crear registros vacios)
         */
      createRegistro () {
        // minizar el paquete de enviada de los productos
        this.detalleOrden = this.productos.map((obj) => {
          const objet = {
            precioUnit: obj.precioUnit,
            upc: obj.upc,
            cantidadProd: obj.cantidad,
            descuento: obj.descuento,
            stockProd: obj.stockProd,
          };
          return objet;
        });
        this.detalleOrden = this.detalleOrden.filter(
          (obj) => obj.cantidadProd > 0,
        );
      },
      formatDate (date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours %= 12;
        hours = hours || 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? `0${  minutes}` : minutes;
        const strTime = `${hours  }:${  minutes  } ${  ampm}`;
        return (
          `${date.getMonth() +
          1
          }/${
          date.getDate()
          }/${
          date.getFullYear()
          } ${
          strTime}`
        );
      },
      dosDecimalesProd(precio) {
        try {
          return precio.toFixed(2);
        } catch (error) {
          return precio;
        }
      },
      errorNotification(state, message) {
        ElMessage({
          showClose: true,
          message,
          type: 'error',
        });
      },
      successNotification(state, message) {
        ElMessage({
          showClose: true,
          message,
          type: 'success',
        });
      },
    },
    actions: {
      initDbOrdenes({ state }) {
        const remoteOrdenes = new state.PouchDB(`${app.config.globalProperties.$url}ordenes`, {
          fetch (url, opts) {
            return state.PouchDB.fetch(url, opts, {
              credentials: 'include',
            });
          },
        });
        remoteOrdenes.info().catch((err) => {
          if (err.status === 401) {
            router
              .push({
                path: '/login',
              })
              .catch(() => {});
          }
        });

        state.localOrdenes = new state.PouchDB('ordenes');
        // do one way, one-off sync from the server until completion
        state.localOrdenes.replicate.from(remoteOrdenes).on('complete', () => {
          // then two-way, continuous, retriable sync
          state.localOrdenes
            .sync(remoteOrdenes, {
              live: true,
              retry: true,
            });
        });
      },
      async createRegistroOrdenes({ state, commit, dispatch }, orden) {
        if (!isLoggedIn()) return;
        // eslint-disable-next-line no-param-reassign
        orden.creation_user = localStorage.getItem('user_name');
        await state.localOrdenes
          .put(orden)
          .then(() => {
            commit('successNotification', 'Orden agregada con éxito');
          })
          .catch((err) => {
            commit('errorNotification', 'Error al guardar la orden.');
            console.error('error trying insert order', err);
          });
        dispatch('productos/reduceQuantity', orden.productos, {root:true})
      },
      getTotalRows({ state }, selector) {
        state.localOrdenes
          .find({ selector, fields: ['_id'] })
          .then((response) => {
            state.totalRows = response.docs.length;
          })
          .catch(window.console.error);
      },
      readAllOrdenes({ state, dispatch }, options = {}) {
        if (!isLoggedIn()) return;
        let skip = 0;
        if (options.pagination?.limit != null && options.pagination?.page != null) {
          skip = options.pagination.limit * (options.pagination.page - 1);
        }
        const selector = {
          selector: {
            _id: {
              ...dateFilterSelector(options.date),
            },
            creation_user: {
              $eq: localStorage.getItem('user_name'),
            },
            ...priceFilterSelector(options.price),
            ...orderTypeFilterSelector(options.orderType),
            ...distributionOrderTypeFilterSelector(options.tipoDistribucion),
            ...orderStatusFilterSelector(options.status),
          },
          limit: options.pagination?.limit || state.defaultPageSize,
          skip,
          sort: [
            {
              _id: 'desc',
            },
          ],
        };
        if (options.pagination?.page === 1) dispatch('getTotalRows', selector.selector);
        state.localOrdenes
        .find(selector)
        .then((response) => {
          state.ordenes = response.docs;
        })
        .catch(window.console.error);
      },
      changeDeliveryStatus({ state, commit }, { id, status }) {
        if (!isLoggedIn()) return;
        state.localOrdenes
          .get(id)
          .then((doc) => {
            // eslint-disable-next-line no-param-reassign
            doc.status = status;
            return state.localOrdenes.put(doc);
          })
          .then(() => {
            commit('successNotification', 'Estado de la orden actualizado con éxito');
          })
          .catch((err) => {
            commit('errorNotification', 'Error al actualizar el estado de la orden');
            console.error('error trying update order status', err);
          });
      },
    },
  });
