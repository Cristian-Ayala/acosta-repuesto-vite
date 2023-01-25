import { ElMessage } from 'element-plus';
import PouchDB from 'pouchdb-browser';
import router from '../../router/index';

export default (app) => ({
    namespaced: true,
    state: {
      ordenes: [],
      orden: {
        nombreCliente: '',
        observacionesOrden: '',
      },
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
      initDbOrdenes({ state, dispatch }) {
        const remoteOrdenes = new state.PouchDB(`${app.config.globalProperties.$url}ordenes`, {
          fetch (url, opts) {
            return state.PouchDB.fetch(url, opts, {
              credentials: 'include',
            });
          },
        });
        remoteOrdenes.info().catch((err) => {
          if (err.status === 401) {
            console.log('no autorizado');
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
          dispatch('readAllOrdenes'); // Get all de ordenes
          // then two-way, continuous, retriable sync
          state.localOrdenes
            .sync(remoteOrdenes, {
              live: true,
              retry: true,
            })
            .on('change', () => {
              dispatch('readAllOrdenes'); // Get all de ordenes
            });
        });
      },
      async createRegistroOrdenes({ state, commit, dispatch }, orden) {
        // For puchDB we need to add an _id field
        await state.localOrdenes
          .put(orden)
          .then(() => {
            dispatch('readAllOrdenes');
            commit('successNotification', 'Orden agregada con éxito');
          })
          .catch((err) => {
            commit('errorNotification', 'Error al guardar la orden.');
            console.error('error trying insert order', err);
          });
        dispatch('productos/reduceQuantity', orden.productos, {root:true})
      },
      readAllOrdenes({ state }) {
        return state.localOrdenes
          .allDocs({
            include_docs: true,
            descending: true,
          })
          .then((result) => {
            state.ordenes = result.rows;
          })
          .catch((err) => {
            console.error('error trying read all orders', err);
          });
      },
    },
  });
