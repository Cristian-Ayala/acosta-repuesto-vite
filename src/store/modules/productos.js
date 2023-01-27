import { ElMessage } from 'element-plus';
import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
import router from '../../router/index';
// import PouchDBQuickSearch from 'pouchdb-quick-search';
PouchDB.plugin(PouchDBFind);
// PouchDB.plugin(PouchDBQuickSearch);

function regexSearch(keyword) {
  if (!keyword || keyword.trim() === '') return 'nonexistent';
  const arrayOfWords = keyword.split(' ');
  const joinedRegex = arrayOfWords.map((word) => word !== ' ' ? `(?=.*${word})`: '').join('');
  return `^${joinedRegex}.+`;
}

export default (app) => ({
  namespaced: true,
  state: {
    productos: [],
    producto: {
      nombreProd: '',
      activoProd: true,
      stockProd: null,
      upc: null,
      nombreMarca: '',
      nombreCategoria: '',
      foto: '',
      precioTaller: 0,
      precioMayoreo: 0,
      precioPublico: 0,
    },
    newProd: [],
    newProductMobile: {},
    PouchDB,
    localProductos: null,
    currentPage: 1,
    perPage: 10,
    totalRows: 0,
    optionsPagination: {
      descending: false,
      limit: 10,
      startkey: null,
      skip: 0,
      selectorFilter: {
        $gt: null,
      },
    },
    paginationHelper: {
      firstDoc: null,
      lastDoc: null,
    },
    filtroCategorias: [],
    filtroMarcas: [],
    filtroNombre: '',
    filtroUPC: '',
    tempFiltroUPC: '',
    calledFrom: '',
  },
  mutations: {
    prodSelected(state, productoSelected) {
      let productoSelectedLocal = { ...productoSelected };
      // check if empty, if it is -> set array with format
      if (!Object.keys(productoSelectedLocal).length) {
        productoSelectedLocal = {
          doc: {
            nombreProd: '',
            activoProd: true,
            stockProd: 0,
            upc: '',
            nombreMarca: '',
            nombreCategoria: '',
            foto: '',
            precioTaller: 0,
            precioMayoreo: 0,
            precioPublico: 0,
          },
        };
      }
      state.newProductMobile = productoSelectedLocal;
    },
    successNotification(state, message) {
      ElMessage({
        showClose: true,
        message,
        type: 'success',
      });
    },
    errorNotification(state, message) {
      ElMessage({
        showClose: true,
        message,
        type: 'error',
      });
    },
    marcaSelected(state, marca) {
      state.newProductMobile.doc.nombreMarca = marca;
    },
    categoriaSelected(state, categoria) {
      state.newProductMobile.doc.nombreCategoria = categoria;
    },
    fotoSelected(state, foto) {
      state.newProductMobile.doc.foto = foto;
    },
    setFiltroUPC(state, upc) {
      state.tempFiltroUPC = upc;
    },
    setCalledFrom(state, calledFrom) {
      state.calledFrom = calledFrom;
    },
  },
  actions: {
    async validarDatos({ state }, productoDoc) {
      try {
        if (!productoDoc.upc) {
          throw new Error('Agregue un UPC');
        }
        const numbersOfUPCs = await state.localProductos
          .find({
            selector: {
              upc: productoDoc.upc,
            },
          })
          .then((response) => response.docs)
          .catch((err) => {
            // an error occured
            window.console.error(err);
            return null;
          });
        if (!productoDoc.nombreProd) {
          throw new Error('El nombre no puede estar vacío');
        }
        if (!productoDoc.foto) {
          throw new Error('Tiene que agregar una foto');
        }
        if (!productoDoc.nombreMarca) {
          throw new Error('Tiene que agregar una Marca');
        }
        if (!productoDoc.nombreCategoria) {
          throw new Error('Tiene que agregar una Categoria');
        }
        if (!(productoDoc.precioMayoreo > 0)) {
          throw new Error('El precio de mayoreo no puede ser menor a 0');
        }
        if (!(productoDoc.precioPublico > 0)) {
          throw new Error('El precio de publico no puede ser menor a 0');
        }
        if (!(productoDoc.precioTaller > 0)) {
          throw new Error('El precio de taller no puede ser menor a 0');
        }
        return numbersOfUPCs;
      } catch (error) {
        return error;
      }
    },
    async createProducto({ state, commit, dispatch }, producto) {
      try {
        const productoDoc = producto[0].doc;
        productoDoc.precioMayoreo = Math.round(productoDoc.precioMayoreo * 100) / 100;
        productoDoc.precioPublico = Math.round(productoDoc.precioPublico * 100) / 100;
        productoDoc.precioTaller = Math.round(productoDoc.precioTaller * 100) / 100;
        const totalNumberOfUPCs = await dispatch('validarDatos', productoDoc);
        if (!(typeof totalNumberOfUPCs.length === 'number')) {
          throw new Error(totalNumberOfUPCs);
        }
        if (totalNumberOfUPCs.length > 0) {
          throw new Error('Ya existe un producto con ese UPC');
        }
        productoDoc._id = new Date().toISOString(); // For puchDB we need to add an _id field
        state.localProductos
          .put(productoDoc)
          .then(() => {
            dispatch('readProducto').then(() => commit('successNotification', 'Producto agregado con éxito'));
          })
          .catch((err) => {
            commit('errorNotification', `Error al guardar el producto ${err}`);
          });
      } catch (err) {
        commit('errorNotification', `Error al guardar el producto ${err}`);
      }
    },
    readProducto({ state, dispatch }) {
      // filtroNombre: "",
      if (state.filtroUPC.trim() !== '') {
        dispatch('readProductsUPC');
        return;
      }
      if (
        state.filtroNombre.trim() !== ''
        || state.filtroCategorias.length > 0
        || state.filtroMarcas.length > 0
      ) {
        dispatch('readProductoCategoriaMarcaNombre');
        return;
      }
      dispatch('readAllProducts');
    },
    async updateProducto({ state, commit, dispatch }, producto) {
      try {
        const productoDoc = { ...producto };
        productoDoc.precioMayoreo = Math.round(productoDoc.precioMayoreo * 100) / 100;
        productoDoc.precioPublico = Math.round(productoDoc.precioPublico * 100) / 100;
        productoDoc.precioTaller = Math.round(productoDoc.precioTaller * 100) / 100;
        const totalNumberOfUPCs = await dispatch('validarDatos', productoDoc);
        if (typeof totalNumberOfUPCs.length !== 'number') throw new Error(totalNumberOfUPCs);
        if (totalNumberOfUPCs.length > 0) {
          if (productoDoc._id !== totalNumberOfUPCs[0]._id) {
            window.console.error(
              'No es el mismo doc así que no se modifica, se arroja error que el upc ya existe',
            );
            throw new Error('El UPC ya existente. Sólo puede haber 1.');
          }
        }
        state.localProductos
          .put(productoDoc)
          .then(() => {
            dispatch('readProducto').then(() => commit('successNotification', 'Producto modificado con éxito'));
          });
      } catch (err) {
        commit('errorNotification', `Error al modificar el producto. ${err}`);
      }
    },
    deleteProducto({ state, commit, dispatch }, productoDel) {
      const producto = productoDel;
      producto.doc._deleted = true;
      producto.doc.activoProd = false;
      state.localProductos
        .put(producto.doc)
        .then(() => {
          dispatch('readProducto').then(() => commit('successNotification', 'Producto eliminado con éxito'));
        })
        .catch((err) => {
          commit('errorNotification', `Error al eliminar el producto ${err}`);
        });
    },
    initDbProductos({ state, dispatch }) {
      const remoteProductos = new state.PouchDB(`${app.config.globalProperties.$url}productos`, {
        fetch(url, opts) {
          return state.PouchDB.fetch(url, opts, {
            credentials: 'include',
          });
        },
      });
      remoteProductos.info().catch((err) => {
        if (err.status === 401) {
          window.console.log('no autorizado');
          router
            .push({
              path: '/login',
            })
            .catch(() => {});
        }
      });

      state.localProductos = new state.PouchDB('productos');
      // do one way, one-off sync from the server until completion
      state.localProductos.replicate
        .from(remoteProductos)
        .on('complete', () => {
          // console.log("Se terminó la replicación");
          dispatch('readProducto');
          // then two-way, continuous, retriable sync
          state.localProductos
            .sync(remoteProductos, {
              live: true,
              retry: true,
            })
            .on('change', () => {
              dispatch('readProducto');
            });
        });
    },
    createIndexes({ state }) {
      state.localProductos
        .createIndex({
          index: {
            fields: ['nombreMarca', 'nombreCategoria'],
            ddoc: 'marcas_categorias',
          },
        })
        .then(() => {
          window.console.log('Index creado');
        })
        .catch((err) => {
          window.console.log(err);
        });
      state.localProductos
        .createIndex({
          index: {
            fields: ['nombreMarca'],
            ddoc: 'marcas',
          },
        })
        .then(() => {
          window.console.log('Index marcas creado');
        })
        .catch((err) => {
          window.console.log(err);
        });
      state.localProductos
        .createIndex({
          index: {
            fields: ['nombreCategoria'],
            ddoc: 'categorias',
          },
        })
        .then(() => {
          window.console.log('Index categorias creado');
        })
        .catch((err) => {
          window.console.log(err);
        });
    },
    readAllProducts({ state }) {
      if (state.currentPage === 1) {
        const settings = { method: 'GET', credentials: 'include' };
        fetch(`${app.config.globalProperties.$url}productos/_design/totalProd/_view/totalProd`, settings)
        .then(resp => resp.json()).then((response) => {
          state.totalRows = response.rows[0].value;
          })
        .catch(window.console.error);
      }
      const totalLimit = state.optionsPagination.skip + state.optionsPagination.limit;
      state.localProductos
        .find({
          selector: {
            _id: {
              ...state.optionsPagination.selectorFilter,
            },
          },
          limit: totalLimit,
          sort: [
            {
              _id: state.optionsPagination.descending ? 'desc' : 'asc',
            },
          ],
        })
        .then((response) => {
          if (state.optionsPagination.descending) {
            // response.docs = response.docs.reverse();
          }
          state.paginationHelper.firstDoc = response.docs[0]._id;
          state.paginationHelper.lastDoc = response.docs[response.docs.length - 1]._id;
          state.productos = response.docs.map((el) => ({
            doc: el,
          })); // para darle formato a la respuesta
        })
        .catch(window.console.error);
    },
    readProductsUPC({ state }) {
      state.localProductos
        .find({
          selector: {
            upc: state.filtroUPC,
          },
        })
        .then((response) => {
          state.totalRows = response.docs.length;
          if (response.docs.length > 0) {
            state.productos = response.docs.map((el) => ({
              doc: el,
            })); // para darle formato a la respuesta
          } else {
            state.productos = [];
          }
        })
        .catch(window.console.error);
    },
    readProductoCategoriaMarcaNombre({ state }) {
      const selector = {};
      selector._id = {
        ...state.optionsPagination.selectorFilter,
      };
      if (state.filtroNombre) {
        selector.nombreProd = {
          $regex: RegExp(state.filtroNombre, 'i'),
        };
      }
      if (state.filtroMarcas.length > 0) {
        selector.nombreMarca = {
          $in: [...state.filtroMarcas],
        };
      }
      if (state.filtroCategorias.length > 0) {
        selector.nombreCategoria = {
          $in: [...state.filtroCategorias],
        };
      }
      // Put code below on an if, it will be called just once
      // This is just to find out how many documents are in total
      // Pagination purposes
      if (state.currentPage === 1) {
        state.localProductos
          .find({ selector })
          .then((response) => {
            state.totalRows = response.docs.length;
          })
          .catch(window.console.error);
      }
      // This is the actual query
      state.localProductos
        .find({
          selector,
          limit: state.optionsPagination.limit,
          sort: [
            {
              _id: state.optionsPagination.descending ? 'desc' : 'asc',
            },
          ],
        })
        .then((response) => {
          if (response.docs.length > 0) {
            // condicional verificando si estan al reves y darles la vuelta
            if (state.optionsPagination.descending) {
              // response.docs = response.docs.reverse();
            }
            state.paginationHelper.firstDoc = response.docs[0]._id;
            state.paginationHelper.lastDoc = response.docs[response.docs.length - 1]._id;
            state.productos = response.docs.map((el) => ({
              doc: el,
            })); // para darle formato a la respuesta
          } else {
            state.productos = [];
          }
        })
        .catch(window.console.error);
    },
    // ----------------------- Start of pagination -----------------------
    lastPage({ state, dispatch }) {
      // startkey
      state.optionsPagination.selectorFilter = {
        $gt: null,
      };
      state.optionsPagination.skip = 0;
      state.optionsPagination.descending = true;
      state.currentPage = Math.ceil(state.totalRows / state.perPage);
      // numer of pages full of products
      const pagesFullofProducts = Math.trunc(state.totalRows / state.perPage);
      // calculate new limit
      const newLimit = state.totalRows - state.perPage * pagesFullofProducts;
      // New limit must be calculates because the last page is not full of products,
      // so it will be less than the perPage
      state.optionsPagination.limit = newLimit;
      dispatch('readProducto');
    },
    firstPage({ state, dispatch }) {
      // startkey
      state.optionsPagination.selectorFilter = {
        $gt: null,
      };
      state.optionsPagination.limit = state.perPage;
      state.optionsPagination.skip = 0;
      state.currentPage = 1;
      state.optionsPagination.descending = false;
      dispatch('readProducto');
    },
    nextPage({ state, dispatch }, page) {
      // startkey
      state.optionsPagination.selectorFilter = {
        $gt: state.paginationHelper.lastDoc,
      };
      state.currentPage = page;
      const lastPage = Math.ceil(state.totalRows / state.perPage);
      if (state.currentPage < lastPage) {
        state.optionsPagination.skip = 1;
        state.optionsPagination.descending = false;
        dispatch('readProducto');
      } else if (lastPage === state.currentPage) {
        dispatch('lastPage');
      }
    },
    prevPage({ state, dispatch }, page) {
      // startkey
      state.optionsPagination.selectorFilter = {
        $lt: state.paginationHelper.firstDoc,
      };
      state.currentPage = page;
      if (state.currentPage > 1) {
        state.optionsPagination.descending = true;
        state.optionsPagination.skip = 1;
        dispatch('readProducto');
      } else if (state.currentPage === 1) {
        dispatch('firstPage');
      }
    },
    setPage({ state, dispatch }, page) {
      if (page === state.currentPage) {
        return;
      }
      state.optionsPagination.limit = state.perPage;
      if (page === 1) {
        dispatch('firstPage');
      } else if (page < state.currentPage) {
        dispatch('prevPage', page);
      } else if (page > state.currentPage) {
        dispatch('nextPage', page);
      }
    },
    // ----------------------- End of pagination -----------------------
    /**
     * Called from AddEditProdMovile when clicked on "confirmar"
     * Decides whether the transaction belongs to a new product (creates it)
     * or if the product has to be updated
     * @param {vuex} param0
     * @param {product} producto
     */
    confirmation({ dispatch }, producto) {
      // Verify in confirmation is for update o create new
      if (producto.doc._rev) {
        dispatch('updateProducto', { ...producto.doc });
      } else {
        dispatch('createProducto', [producto]);
      }
    },
    aplicarFiltros({ state, dispatch }, prod) {
      state.filtroCategorias = prod.cat;
      state.filtroMarcas = prod.mar;
      state.filtroUPC = prod.upc;
      state.filtroNombre = prod.nom;
      dispatch('firstPage');
    },
    borrarFiltros({ state, dispatch }) {
      state.filtroCategorias = [];
      state.filtroMarcas = [];
      state.filtroUPC = '';
      state.filtroNombre = '';
      dispatch('firstPage');
    },
    async searchProductos({ state }, variables) {
      if (!variables.keyword) return [];
      let resultado = null;
      await state.localProductos
        .find({
          selector: {
            $or: [
              { upc: variables.keyword },
              { nombreProd: { $regex: RegExp(regexSearch(variables.keyword), 'i') } }
            ]
          },
          limit: variables.limit,
          skip: variables.skip,
        })
        .then((res) => {
          resultado = res.docs;
          // state.findProductos = res.rows;
          // state.searchTotalRows = res.total_rows;
        })
        .catch((err) => {
          console.error(err);
        });
        return resultado;
    },
    reduceQuantity(store, detalleOrden) {
      Promise.all(detalleOrden.map((producto) => {
        const settings = {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cantidad: producto.cantidad }),
            credentials: 'include',
        };
        return fetch(`${app.config.globalProperties.$url}productos/_design/productHandler/_update/reduceQuantity/${producto._id}`, settings);
      }));
      // .then(resp => resp.json()).then(console.log);
    }
  },
});
