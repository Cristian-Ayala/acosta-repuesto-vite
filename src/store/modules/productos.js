import { apolloClient } from "@/plugins/vue-apollo";
import { GET_PRODUCTOS } from "@/store/graphql/queries/productos";

function regexSearch(keyword) {
  if (!keyword || keyword.trim() === "") return "nonexistent";
  const arrayOfWords = keyword.split(" ");
  const joinedRegex = arrayOfWords
    .map((word) => (word !== " " ? `(?=.*${word})` : ""))
    .join("");
  return `^${joinedRegex}.+`;
}

export default (app) => ({
  namespaced: true,
  state: {
    productos: [],
    producto: {
      nombreProd: "",
      activoProd: true,
      stockProdStaAna: null,
      stockProdMetapan: null,
      upc: null,
      nombreMarca: "",
      nombreCategoria: "",
      foto: "",
      precioTaller: 0,
      precioMayoreo: 0,
      precioPublico: 0,
    },
    newProd: [],
    newProductMobile: {},
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
    filtroNombre: "",
    filtroUPC: "",
    tempFiltroUPC: "",
    calledFrom: "",
    prodSearchInOrdtotRows: 0,
    variables: {},
  },
  mutations: {
    prodSelected(state, productoSelected) {
      let productoSelectedLocal = { ...productoSelected };
      // check if empty, if it is -> set array with format
      if (!Object.keys(productoSelectedLocal).length) {
        productoSelectedLocal = {
          doc: {
            nombreProd: "",
            activoProd: true,
            stockProdStaAna: 0,
            stockProdMetapan: 0,
            upc: "",
            nombreMarca: "",
            nombreCategoria: "",
            foto: "",
            precioTaller: 0,
            precioMayoreo: 0,
            precioPublico: 0,
          },
        };
      }
      state.newProductMobile = productoSelectedLocal;
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
          throw new Error("Agregue un UPC");
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
          throw new Error("El nombre no puede estar vacío");
        }
        if (!productoDoc.foto) {
          throw new Error("Tiene que agregar una foto");
        }
        if (!productoDoc.nombreMarca) {
          throw new Error("Tiene que agregar una Marca");
        }
        if (!productoDoc.nombreCategoria) {
          throw new Error("Tiene que agregar una Categoria");
        }
        if (!(productoDoc.precioMayoreo > 0)) {
          throw new Error("El precio de mayoreo no puede ser menor a 0");
        }
        if (!(productoDoc.precioPublico > 0)) {
          throw new Error("El precio de publico no puede ser menor a 0");
        }
        if (!(productoDoc.precioTaller > 0)) {
          throw new Error("El precio de taller no puede ser menor a 0");
        }
        return numbersOfUPCs;
      } catch (error) {
        return error;
      }
    },
    async createProducto({ state, commit, dispatch }, producto) {
      try {
        const productoDoc = producto[0].doc;
        productoDoc.precioMayoreo =
          Math.round(productoDoc.precioMayoreo * 100) / 100;
        productoDoc.precioPublico =
          Math.round(productoDoc.precioPublico * 100) / 100;
        productoDoc.precioTaller =
          Math.round(productoDoc.precioTaller * 100) / 100;
        const totalNumberOfUPCs = await dispatch("validarDatos", productoDoc);
        if (!(typeof totalNumberOfUPCs.length === "number")) {
          throw new Error(totalNumberOfUPCs);
        }
        if (totalNumberOfUPCs.length > 0) {
          throw new Error("Ya existe un producto con ese UPC");
        }
        productoDoc._id = new Date().toISOString(); // For puchDB we need to add an _id field
        state.localProductos
          .put(productoDoc)
          .then(() => {
            dispatch("readProducto").then(() =>
              commit("successNotification", "Producto agregado con éxito"),
            );
          })
          .catch((err) => {
            commit("errorNotification", `Error al guardar el producto ${err}`);
          });
      } catch (err) {
        commit("errorNotification", `Error al guardar el producto ${err}`);
      }
    },
    async readAllProducts({ state, commit, dispatch }, variables) {
      try {
        if (variables != null && variables.useStoredVariables === true)
          state.variables = variables;
        else state.variables = await dispatch("getQueryFilters");
        state.loadingTableProductos = true;
        const searchInfo = {
          query: GET_PRODUCTOS,
          fetchPolicy: "network-only",
          variables: state.variables,
        };
        const result = await apolloClient.query(searchInfo);
        if (result && result.data) {
          state.productos = result.data.productos;
          state.totalRows = result.data.totalRows.aggregate.count;
        }
        state.loadingTableProductos = false;
      } catch (err) {
        window.console.error(err);
        commit(
          "common/errorNotification",
          `Error al listar productos. ${err}`,
          { root: true },
        );
        state.loadingTableProductos = false;
      }
    },
    async updateProducto({ state, commit, dispatch }, producto) {
      try {
        const productoDoc = { ...producto };
        productoDoc.precioMayoreo =
          Math.round(productoDoc.precioMayoreo * 100) / 100;
        productoDoc.precioPublico =
          Math.round(productoDoc.precioPublico * 100) / 100;
        productoDoc.precioTaller =
          Math.round(productoDoc.precioTaller * 100) / 100;
        const totalNumberOfUPCs = await dispatch("validarDatos", productoDoc);
        if (typeof totalNumberOfUPCs.length !== "number")
          throw new Error(totalNumberOfUPCs);
        if (totalNumberOfUPCs.length > 0) {
          if (productoDoc._id !== totalNumberOfUPCs[0]._id) {
            window.console.error(
              "No es el mismo doc así que no se modifica, se arroja error que el upc ya existe",
            );
            throw new Error("El UPC ya existente. Sólo puede haber 1.");
          }
        }
        state.localProductos.put(productoDoc).then(() => {
          dispatch("readProducto").then(() =>
            commit("successNotification", "Producto modificado con éxito"),
          );
        });
      } catch (err) {
        commit("errorNotification", `Error al modificar el producto. ${err}`);
      }
    },
    deleteProducto({ state, commit, dispatch }, productoDel) {
      const producto = productoDel;
      producto.doc.activoProd = false;
      state.localProductos
        .put(producto.doc)
        .then(() => {
          dispatch("readProducto").then(() =>
            commit("successNotification", "Producto eliminado con éxito"),
          );
        })
        .catch((err) => {
          commit("errorNotification", `Error al eliminar el producto ${err}`);
        });
    },
    setPage({ state, dispatch }, page) {
      if (page === state.currentPage) return;
      state.currentPage = page;
      dispatch("readAllProducts");
    },
    /**
     * Called from AddEditProdMovile when clicked on "confirmar"
     * Decides whether the transaction belongs to a new product (creates it)
     * or if the product has to be updated
     * @param {vuex} param0
     * @param {product} producto
     */
    confirmation({ dispatch }, producto) {
      // Verify in confirmation is for update o create new
      /* eslint-disable-next-line */
      if (producto.doc._rev) {
        dispatch("updateProducto", { ...producto.doc });
      } else {
        dispatch("createProducto", [producto]);
      }
    },
    getQueryFilters({ state }) {
      const where = {
        is_active_producto: { _eq: true },
      };
      if (state.filtroUPC != null && state.filtroUPC.length) {
        where.upc = {
          _eq: state.filtroUPC,
        };
        return {
          where,
          limit: state.perPage,
          offset: state.perPage * (state.currentPage - 1),
        };
      }
      if (state.filtroNombre != null && state.filtroNombre.length) {
        where.nombre_producto = {
          _ilike: `%${state.filtroNombre}%`,
        };
      }
      if (state.filtroMarcas != null && state.filtroMarcas.length) {
        where.id_marca = {
          _in: state.filtroMarcas.map((marca) => marca.id),
        };
      }
      if (state.filtroCategorias != null && state.filtroCategorias.length) {
        where.id_categoria = {
          _in: state.filtroCategorias.map((cat) => cat.id),
        };
      }
      return {
        where,
        limit: state.perPage,
        offset: state.perPage * (state.currentPage - 1),
      };
    },
    aplicarFiltros({ state, dispatch }, prod) {
      state.filtroCategorias = prod.cat;
      state.filtroMarcas = prod.mar;
      state.filtroUPC = prod.upc;
      state.filtroNombre = prod.nom;
      dispatch("readAllProducts");
    },
    borrarFiltros({ state, dispatch }) {
      state.filtroCategorias = [];
      state.filtroMarcas = [];
      state.filtroUPC = "";
      state.filtroNombre = "";
      dispatch("readAllProducts");
    },
    /* TODO: Delete this function when order is implemented */
    getTotalProductosSearchOrdenes({ state }, selector) {
      state.localProductos
        .find({ selector, fields: ["_id"] })
        .then((response) => {
          state.prodSearchInOrdtotRows = response.docs.length;
        })
        .catch(window.console.error);
    },
    /* TODO: Delete this function when order is implemented */
    async searchProductos({ state, dispatch }, variables) {
      if (!variables.keyword) {
        state.prodSearchInOrdtotRows = 0;
        return [];
      }
      let resultado = null;
      const searchParameters = {
        selector: {
          $or: [
            { upc: variables.keyword },
            {
              nombreProd: {
                $regex: RegExp(regexSearch(variables.keyword), "i"),
              },
            },
          ],
        },
        limit: variables.limit,
        skip: variables.skip,
      };
      if (variables.pagination?.page === 1)
        dispatch("getTotalProductosSearchOrdenes", searchParameters.selector);
      await state.localProductos
        .find(searchParameters)
        .then((res) => {
          resultado = res.docs;
        })
        .catch((err) => {
          console.error(err);
        });
      return resultado;
    },
    /* TODO: Delete this function when order is implemented */
    reduceQuantity(store, detalleOrden) {
      const organizationDivision = localStorage.getItem("org_division");
      Promise.all(
        detalleOrden.map((producto) => {
          const settings = {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cantidad: producto.cantidad,
              organization_division: organizationDivision,
            }),
            credentials: "include",
          };
          return fetch(
            `${app.config.globalProperties.$url}productos/_design/productHandler/_update/reduceQuantity/${producto._id}`,
            settings,
          );
        }),
      );
      // .then(resp => resp.json()).then(console.log);
    },
  },
});
