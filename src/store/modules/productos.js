import { apolloClient } from "@/plugins/vue-apollo";
import {
  GET_PRODUCTOS,
  GET_PRODUCT_BY_UPC,
} from "@/store/graphql/queries/productos";
import {
  CREATE_UPDATE_PRODUCTO,
  DELETE_PRODUCTO,
} from "@/store/graphql/mutations/productos";

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
    // TODO: Delete all mutations if not used
    marcaSelected(state, marca) {
      state.newProductMobile.doc.nombreMarca = marca;
    },
    categoriaSelected(state, categoria) {
      state.newProductMobile.doc.nombreCategoria = categoria;
    },
    setFiltroUPC(state, upc) {
      state.tempFiltroUPC = upc;
    },
    setCalledFrom(state, calledFrom) {
      state.calledFrom = calledFrom;
    },
  },
  actions: {
    async createProducto({ commit, dispatch }, producto) {
      try {
        const uniqueUPC = await dispatch("uniqueUPC", { upc: producto.upc });
        if (uniqueUPC != null) {
          dispatch("upcMessages", uniqueUPC);
          return null;
        }
        if (producto.foto && producto.foto instanceof File) {
          const fotoUploaded = await dispatch(
            "uploadAttachments",
            producto.foto,
          );
          /* eslint-disable */
          delete producto.UPLOAD_NEW_PICTURE;
          producto.foto = fotoUploaded != null ? fotoUploaded[0] : "";
          /* eslint-enable */
        }
        const searchInfo = {
          mutation: CREATE_UPDATE_PRODUCTO,
          variables: {
            producto,
            update_columns: [
              "nombre_producto",
              "upc",
              "id_marca",
              "id_categoria",
              "foto",
              "precio_taller",
              "precio_mayoreo",
              "precio_publico",
              "stock_prod_sta_ana",
              "stock_prod_metapan",
            ],
          },
        };
        const result = await apolloClient.mutate(searchInfo);
        let productoInserted = null;
        if (
          result &&
          result.data &&
          result.data.insert_acostarep_productos_one
        ) {
          productoInserted = result.data.insert_acostarep_productos_one;
          commit("common/successNotification", "Producto creado con éxito", {
            root: true,
          });
          dispatch("readAllProducts");
        }
        return productoInserted;
      } catch (err) {
        commit(
          "common/errorNotification",
          `Error al guardar el producto ${err}`,
          { root: true },
        );
        return null;
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
    async updateProducto({ commit, dispatch }, prod) {
      try {
        const updateColumns = [
          "nombre_producto",
          "upc",
          "id_marca",
          "id_categoria",
          "precio_taller",
          "precio_mayoreo",
          "precio_publico",
          "stock_prod_sta_ana",
          "stock_prod_metapan",
          "foto",
        ];
        const producto = JSON.parse(JSON.stringify(prod));
        const uniqueUPC = await dispatch("uniqueUPC", {
          upc: producto.upc,
          id: producto.id,
        });
        if (uniqueUPC != null) {
          dispatch("upcMessages", uniqueUPC);
          return null;
        }
        if (producto.UPLOAD_NEW_PICTURE) {
          const fotoUploaded = await dispatch("uploadAttachments", prod.foto);
          delete producto.UPLOAD_NEW_PICTURE;
          producto.foto = fotoUploaded != null ? fotoUploaded[0] : "";
        } else if (typeof producto.foto === "string") {
          [, producto.foto] = prod.foto.split("/photo/");
        }
        const searchInfo = {
          mutation: CREATE_UPDATE_PRODUCTO,
          variables: {
            producto,
            update_columns: updateColumns,
          },
        };
        const result = await apolloClient.mutate(searchInfo);
        let productoInserted = null;
        if (
          result &&
          result.data &&
          result.data.insert_acostarep_productos_one
        ) {
          productoInserted = result.data.insert_acostarep_productos_one;
          commit("common/successNotification", "Producto editado con éxito", {
            root: true,
          });
          dispatch("readAllProducts");
        }
        return productoInserted;
      } catch (err) {
        window.console.error(err);
        commit(
          "common/errorNotification",
          `Error al modificar el producto. ${err}`,
          { root: true },
        );
        return null;
      }
    },
    async deleteProducto({ commit, dispatch }, variables) {
      try {
        const result = await apolloClient.mutate({
          mutation: DELETE_PRODUCTO,
          variables,
        });
        if (!result || result.errors)
          throw new Error("al eliminar el producto.\n", result.errors);
        commit("common/successNotification", "Producto eliminado con éxito", {
          root: true,
        });
        dispatch("readAllProducts");
      } catch (error) {
        commit(
          "common/errorNotification",
          `Error al eliminar el producto ${error}`,
          { root: true },
        );
        window.console.error("ERROR:", error);
      }
    },
    async uniqueUPC(store, variables) {
      try {
        const searchInfo = {
          query: GET_PRODUCT_BY_UPC,
          fetchPolicy: "network-only",
          variables,
        };
        const result = await apolloClient.query(searchInfo);
        let numbersOfUPCs = null;
        if (result && result.data && result.data.listUPC.length > 0) {
          [numbersOfUPCs] = result.data.listUPC;
        }
        return numbersOfUPCs;
      } catch (error) {
        window.console.error("error", error);
        return { ERROR: true, error };
      }
    },
    upcMessages({ commit }, uniqueUPC) {
      if (uniqueUPC.ERROR) {
        commit(
          "common/errorNotification",
          `Error al buscar UPC duplicador.
          ${uniqueUPC.error}`,
          { root: true },
        );
      }
      commit(
        "common/errorNotification",
        `UPC duplicado: ${uniqueUPC.upc}
        Nombre del producto: ${uniqueUPC.nombre_producto}`,
        { root: true },
      );
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
    async confirmation({ dispatch }, producto) {
      if (producto.id) {
        return dispatch("updateProducto", producto);
      }
      return dispatch("createProducto", producto);
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
    async uploadAttachments({ commit }, file) {
      try {
        if (!(file instanceof File)) return null;
        const url = `${app.config.globalProperties.$FILE_MANAGER}upload-photo`;
        const bodyFormData = new FormData();
        bodyFormData.append("file", file);
        bodyFormData.append("userEmail", localStorage.getItem("email"));
        return fetch(url, {
          method: "POST",
          body: bodyFormData,
          redirect: "follow",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.errors) throw new Error(data.errors);
            return data.savedFileNames;
          })
          .catch((error) => {
            throw new Error(error);
          });
      } catch (error) {
        commit("common/errorNotification", `Error al cargar imagen. ${error}`, {
          root: true,
        });
        window.console.error("error in uploadAttachments", error);
        return null;
      }
    },
  },
});
