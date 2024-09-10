<template>
  <div id="domVue" class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem; margin-bottom: 3rem">
        <div class="card">
          <div class="card-header">
            <div class="cardHeaderWrapper">
              <h6
                id="productosTitle"
                class="text-uppercase mb-0"
                style="display: inline-block"
              >
                Productos
              </h6>
              <el-button
                v-if="isAbleToModify"
                color="#28a745"
                circle
                @click="createProduct()"
              >
                <i class="fa fa-plus" aria-hidden="true"></i>
              </el-button>
            </div>
            <div class="filtros">
              <div class="d-inline-flex pr-2 pb-2">
                <el-button
                  ref="btnFiltros"
                  type="primary"
                  round
                  @click="clickFiltros()"
                >
                  Filtros ({{ allFilters.length }})
                </el-button>
              </div>
              <div
                v-if="allFilters && allFilters.length > 0"
                class="d-inline-flex auto-scroll pb-2"
              >
                <el-button
                  v-for="filter in allFilters"
                  :key="filter"
                  type="primary"
                  round
                  disabled
                  class="btn-sm pr-2 pl-2"
                  @click="show.modalFiltros"
                >
                  {{ filter }}
                </el-button>
              </div>
            </div>
          </div>
          <div v-if="loadingTableProductos" class="skeletonContainer">
            <loading-productos v-for="i in 8" :key="i"></loading-productos>
          </div>
          <div v-else class="bodyProducts">
            <el-card
              v-for="prod in productos"
              :key="prod.upc"
              :body-style="{ padding: '0px' }"
            >
              <img-with-back-up
                :source="`${$FILE_MANAGER}photo/${prod.foto}`"
              />
              <div style="padding: 14px; text-align: center">
                <span>{{ prod.nombre_producto }}</span>
                <div class="bottom">
                  <!-- UPC: {{ prod.upc }}<br /> -->
                  <div style="display: flex; justify-content: space-around">
                    <span class="productPrices">
                      P.M.: <br />${{ prod.precio_mayoreo }}
                    </span>
                    <span class="productPrices">
                      P.P.: <br />${{ prod.precio_publico }}
                    </span>
                    <span class="productPrices">
                      P.T.: <br />${{ prod.precio_taller }}
                    </span>
                  </div>
                  Stock: {{ getStock(prod) }}<br />
                  Marca: {{ prod.marca?.nombre_marca }}<br />
                  Categoria: {{ prod.categoria?.nombre_categoria }}<br />
                </div>
                <el-button
                  v-if="isAbleToModify"
                  type="warning"
                  circle
                  @click="
                    prodSelected = JSON.parse(JSON.stringify(prod));
                    title = 'Editar producto';
                    show.addEditProdMovile = true;
                  "
                >
                  <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                </el-button>
                <el-button
                  v-if="isAbleToModify"
                  type="danger"
                  circle
                  @click="deleteProd(prod)"
                >
                  <i class="fas fa-times" aria-hidden="true"></i>
                </el-button>
                <el-button
                  :type="
                    ordenDetalleProductos[prod.id]?.cantidad
                      ? 'warning'
                      : 'success'
                  "
                  plain
                  style="width: 100%; margin: 0.5rem 0 0 0"
                  @click="
                    prodSelected = JSON.parse(JSON.stringify(prod));
                    show.addToCartModal = true;
                  "
                >
                  <i class="fas fa-cart-plus" aria-hidden="true"></i>
                  <span style="padding-left: 0.5em">
                    {{
                      ordenDetalleProductos[prod.id]?.cantidad
                        ? "Agregar/Quitar"
                        : "Agregar"
                    }}
                  </span>
                </el-button>
              </div>
            </el-card>
            <el-empty
              v-if="productos.length === 0"
              description="Productos no encontrados"
            />
          </div>
          <div class="mt-3" style="margin-left: -12px">
            <el-pagination
              :current-page="currentPage"
              small
              background
              layout="prev, pager, next"
              :total="totalRows"
              :page-size="perPage"
              hide-on-single-page
              @current-change="handleChangePage($event)"
            />
          </div>
        </div>
      </div>
      <!-- eslint-disable  vue/component-name-in-template-casing -->
      <DraggableButton
        v-if="showCartButton && Object.keys(ordenDetalleProductos).length"
      >
        <el-button
          class="cartButton"
          type="success"
          size="large"
          circle
          @click="show.newOrder = true"
        >
          <i
            class="fas fa-cart-plus"
            aria-hidden="true"
            style="font-size: large"
          ></i>
        </el-button>
      </DraggableButton>
      <NuevaOrden v-if="show.newOrder" :show="show"></NuevaOrden>
      <AddEditProdMovile
        v-if="show.addEditProdMovile"
        :title="title"
        :mostrar="show"
        :prod-selected="prodSelected"
        @loading-product="loadingProduct"
      ></AddEditProdMovile>
      <EliminarProdMovil
        v-if="show.deleteProduc"
        :mostrar="show"
        :new-product-mobile="prodSelected"
      ></EliminarProdMovil>
      <AddToCartModal
        v-if="show.addToCartModal"
        :prod-selected="prodSelected"
        :mostrar="show"
      ></AddToCartModal>
      <FiltrosProductos ref="filtrosRef" :mostrar="show"></FiltrosProductos>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { defineAsyncComponent } from "vue";

export default {
  name: "ProductosIndex",
  components: {
    AddEditProdMovile: defineAsyncComponent(() =>
      import("@/components/Productos/AddEditProdMovile.vue"),
    ),
    EliminarProdMovil: defineAsyncComponent(() =>
      import("@/components/Productos/EliminarProdMovil.vue"),
    ),
    AddToCartModal: defineAsyncComponent(() =>
      import("@/components/Productos/AddToCartModal.vue"),
    ),
    FiltrosProductos: () =>
      import("@/components/Productos/FiltrosProductos.vue"),
    ImgWithBackUp: () => import("@/components/ImgWithBackUp.vue"),
    LoadingProductos: () =>
      import("@/components/Productos/LoadingProductos.vue"),
    DraggableButton: defineAsyncComponent(() =>
      import("@/components/Productos/DraggableButton.vue"),
    ),
    NuevaOrden: defineAsyncComponent(() =>
      import("@/components/Ordenes/NuevaOrden.vue"),
    ),
  },
  data() {
    return {
      displayOption: "",
      searchDisplay: "",
      tab: "",
      title: "Editar",
      show: {
        addEditProdMovile: false,
        modalFiltros: false,
        deleteProduc: false,
        addToCartModal: false,
        newOrder: false,
      },
      prodSelected: null,
    };
  },
  computed: {
    ...mapState("auth", ["isAbleToModify", "userProfile"]),
    ...mapState("productos", [
      "currentPage",
      "loadingTableProductos",
      "productos",
      "producto",
      "perPage",
      "totalRows",
      "filtroCategorias",
      "filtroMarcas",
      "filtroNombre",
      "filtroUPC",
      "ordenDetalleProductos",
    ]),
    allFilters() {
      const filters = [];
      const categories = this.filtroCategorias.map(
        (cat) => cat?.nombre_categoria,
      );
      const brands = this.filtroMarcas.map((marca) => marca?.nombre_marca);
      if (this.filtroNombre) {
        filters.push(this.filtroNombre);
      }
      if (this.filtroUPC) {
        filters.push(this.filtroUPC);
      }
      return filters.concat(categories).concat(brands);
    },
    showCartButton() {
      if (Object.values(this.show).some((value) => value === true))
        return false;
      return true;
    },
  },
  watch: {},
  mounted() {
    this.$store.dispatch("ordenes/GET_TYPES");
    this.fetchProducts();
  },
  methods: {
    clickFiltros() {
      document.activeElement.blur();
      this.show.modalFiltros = true;
    },
    ...mapMutations("productos", [
      "clearData",
      "removeRegistro",
      "editProd",
      "saveEditProd",
      "undoEditProd",
      "transactionRemove",
      "addProd",
      "removeNewRegistro",
      "saveNewProduct",
      "editNewRegistro",
    ]),
    fetchProducts() {
      this.$store.dispatch("productos/readAllProducts");
    },

    filtro(valor) {
      if (this.searchDisplay.trim() === "") return true;
      const array = (
        this.productos[valor].nombreProd +
        this.productos[valor].descripcion +
        this.productos[valor].precioUnit +
        this.productos[valor].stockProd +
        this.productos[valor].upc
      ).toUpperCase();
      return array.indexOf(this.searchDisplay.toUpperCase()) >= 0;
    },
    createProduct() {
      document.activeElement.blur();
      this.prodSelected = { CLEAR: true };
      this.title = "Agregar producto";
      this.show.addEditProdMovile = true;
    },
    deleteProd(prod) {
      document.activeElement.blur();
      this.prodSelected = JSON.parse(JSON.stringify(prod));
      this.show.deleteProduc = true;
    },
    getStock(prod) {
      switch (this.userProfile.locationSelected) {
        case "Santa Ana":
          return prod.stock_prod_sta_ana;
        case "Metapan":
          return prod.stock_prod_metapan;
        default:
          window.console.warn("No se encontró la división");
          return 0;
      }
    },
    handleChangePage(currentPage) {
      this.$store.dispatch("productos/setPage", currentPage);
    },
    loadingProduct(value) {
      let loading = null;
      this.$nextTick(() => {
        loading = this.$loading({ fullscreen: true });
        if (!value) loading.close();
      });
    },
  },
};
</script>

<style scoped>
.nav-tabs .nav-link.active,
.nav-tabs .nav-item.show .nav-link {
  color: #ffffff !important;
  background-color: #e84b63 !important;
}
.nav-tabs .nav-link:hover {
  color: #e10d2d;
  background-color: #f1f1f1;
}
tr:hover input.form-control {
  background-color: #ececec !important;
}
tr input.form-control {
  /* border: thin; */
  height: auto;
}
thead {
  text-align: center;
}
/* .inputDanger {
  border-color: red;
}
.inputSuccess {
  border-color: #28a745;
} */
th input,
td input {
  display: inline-block;
}
.btn-circle {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
}
.deleteRow {
  border-left: 0.5rem solid #df4b4b !important;
}
.editRow {
  border-left: 0.5rem solid #ffc107;
}
.editedRow {
  border-left: 0.5rem solid #4b99e8;
}
/* Onclick edit-> show inputs intead of text */
.edit {
  display: none;
}
.editing .edit {
  display: block;
}
.editing .view {
  display: none;
}
.borderDanger {
  border-color: #dc3545 !important;
}
@media (max-width: 1000px) {
  .card-body {
    background-color: #f8f9fb;
    padding: 1rem;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    flex-direction: column;
    border-bottom-left-radius: calc(1rem - 1px);
    border-bottom-right-radius: calc(1rem - 1px);
  }
  .card-body div.cardProductosMobile {
    margin: 5px;
  }
  .card.cardProductosMobile {
    margin-bottom: 1rem;
    box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 40%);
  }
  .cardProductosMobile {
    width: 100%;
    display: inline-flex;
  }
  .cardProductosMobile img {
    /* width: 150px; */
    align-self: center;
  }
}
:deep(li.page-item.bv-d-xs-down-none) {
  display: none;
}
.filtros {
  box-shadow: 1px 0.5rem 0.8rem rgb(0 0 0 / 10%);
  padding: 0.5rem;
  display: flex;
  border-radius: 1rem;
}
:deep(.card-header) {
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
  display: block;
  padding: 0;
  margin-bottom: 1rem;
  border-radius: 1rem;
}
.cardHeaderWrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 1rem;
}
:deep(.card) {
  background-color: #f8f9fb;
  border: none;
  box-shadow: none;
}
:deep(.auto-scroll) {
  overflow: scroll;
  user-select: none;
  padding-bottom: 0.5 rem;
}
.el-button.is-circle {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
}
.bodyProducts {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.productPrices {
  color: #409eff;
  border-radius: 0.3rem;
  background-color: #ecf5ff;
  border: 1px solid #409eff;
  padding: 0.2rem;
  transform: scale(0.9);
}
div:deep(.el-pagination.is-background.el-pagination--small) {
  justify-content: center;
}
:global(footer.el-dialog__footer) {
  padding: var(--el-dialog-padding-primary);
}
:deep(ul.el-pager > li.number) {
  display: none;
}
:deep(ul.el-pager > li.number.is-active),
:deep(ul.el-pager > li:first-child),
:deep(ul.el-pager > li:last-child) {
  display: block;
}
:deep(ul.el-pager > li.more) {
  pointer-events: none;
}
.skeletonContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  justify-items: center;
}
.cartButton {
  border: 1px solid #656565;
  box-shadow: -1px 0rem 2rem rgb(0 0 0 / 64%);
  width: 2.5rem !important;
  height: 2.5rem !important;
}
.bodyProducts:has(div.el-empty) {
  display: block;
}
</style>
