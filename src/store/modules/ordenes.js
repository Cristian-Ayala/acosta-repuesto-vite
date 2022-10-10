import PouchDB from 'pouchdb-browser';
import router from '../../router/index';

export default () => ({
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
      findProductos: [],
      searchTotalRows: 0,
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
      alertNotification(state, { message, duration }) {
        this.$awn.alert(message, {
          durations: {
            success: duration,
          },
        });
      },
      successNotification(state, { message, duration, tittle }) {
        this.$awn.success(message, {
          durations: {
            success: duration,
          },
          labels: {
            success: tittle,
          },
        });
      },
    },
    actions: {
      initDbOrdenes({ state, dispatch }) {
        console.log(state, PouchDB);
        dispatch('searchProductos');
        const remoteOrdenes = new state.PouchDB(`${this.$url  }ordenes`, {
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
          // console.log("Se terminó la replicación");
          dispatch('readAllOrdenes'); // Get all de ordenes
          // dispatch("createIndexes");
          // then two-way, continuous, retriable sync
          state.localOrdenes
            .sync(remoteOrdenes, {
              live: true,
              retry: true,
            })
            .on('change', (change) => {
              console.log('yo, something changed!', change);
              dispatch('readAllOrdenes'); // Get all de ordenes
            })
            .on('paused', (info) => {
              console.log(
                'replication was paused, usually because of a lost connection',
                info,
              );
            })
            .on('active', (info) => {
              console.log('replication was resumed', info);
            })
            .on('denied', (err) => {
              console.log(
                'a document failed to replicate (e.g. due to permissions)',
                err,
              );
            })
            .on('complete', (info) => {
              console.log('Completado', info);
            })
            .on('error', (err) => {
              console.log('totally unhandled error (shouldn\'t happen)', err);
            });
        });
      },
      async createRegistroOrdenes({ state, commit, dispatch }, orden) {
        // For puchDB we need to add an _id field
        return state.localOrdenes
          .put(orden)
          .then(() => {
            dispatch('readAllOrdenes');
            commit('successNotification', {
              message: 'Orden agregada con éxito',
              tittle: 'EXITO',
              duration: 4000,
            });
          })
          .catch((err) => {
            commit('alertNotification', {
              message: `Error al guardar la orden<br>${  err}`,
              duration: 4000,
            });
            console.error('error trying insert order', err);
          });
      },
      readAllOrdenes({ state }) {
        return state.localOrdenes
          .allDocs({
            include_docs: true,
            descending: true,
          })
          .then((result) => {
            console.log('read', result);
            state.ordenes = result.rows;
          })
          .catch((err) => {
            console.error('error trying read all orders', err);
          });
      },
      searchProductos({ state }, searchProduct) {
        // console.log("This is the state from Ordenes :B\n", this.state.productos.localProductos);
        this.state.productos.localProductos
          .search({
            query: searchProduct,
            fields: ['nombreProd', 'upc'],
            include_docs: true,
            highlighting: true,
            limit: 10,
            skip: state.skipPagination,
            mm: '33%',
          })
          .then((res) => {
            state.findProductos = res.rows;
            state.searchTotalRows = res.total_rows;
            // console.log(res);
          })
          .catch((err) => {
            console.err(err);
          });
      },
      paginationNavPlugin({ state, dispatch }, { prevOrNext, searchProduct }) {
        if (prevOrNext === 'prev') {
          if (state.currentPage > 1) {
            state.currentPage -= 1;
            state.skipPagination -= 10;
            dispatch('searchProductos', searchProduct);
          }
        } else {
          const totalPages = Math.ceil(state.searchTotalRows / 10);
          if (state.currentPage < totalPages) {
            state.currentPage += 1;
            state.skipPagination += 10;
            dispatch('searchProductos', searchProduct);
          }
        }
      },
    },
  });
