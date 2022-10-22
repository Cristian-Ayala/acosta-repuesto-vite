<template>
  <div id="domVue" class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem; margin-bottom: 3rem">
        <div class="card">
          <div class="card-header">
            <div class="cardHeaderWrapper">
              <h6 class="text-uppercase mb-0" style="display: inline-block">
                Productos
              </h6>
              <el-button color="#28a745" circle @click="createProduct()">
                <i class="fa fa-plus" aria-hidden="true"></i>
              </el-button>
            </div>
            <div class="filtros">
              <div class="d-inline-flex pr-2 pb-2">
                <el-button type="primary" round @click="show.modalFiltros"
                >Filtros ({{ allFilters.length }})</el-button>
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
          <div class="bodyProducts">
            <el-card
              v-for="prod in productos"
              :key="prod.upc"
              :body-style="{ padding: '0px' }"
            >
              <img :src="prod.doc.foto" class="image">
              <div style="padding: 14px; text-align: center">
                <span>{{ prod.doc.nombreProd }}</span>
                <div class="bottom">
                  <!-- UPC: {{ prod.doc.upc }}<br /> -->
                  <div style="display: flex; justify-content: space-around">
                    <span class="productPrices"
                    >P.M.: <br>${{ prod.doc.precioMayoreo }}</span
                    >
                    <span class="productPrices"
                    >P.P.: <br>${{ prod.doc.precioPublico }}</span
                    >
                    <span class="productPrices"
                    >P.T.: <br>${{ prod.doc.precioTaller }}</span
                    >
                  </div>
                  Stock: {{ prod.doc.stockProd }}<br>
                  Marca: {{ prod.doc.nombreMarca }}<br>
                  Categoria: {{ prod.doc.nombreCategoria }}<br>
                </div>
                <el-button
                  type="warning"
                  circle
                  @click="
                    prodSelected(prod);
                    title = 'Editar producto';
                    show.addEditProdMovile = true;
                  "
                >
                  <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                </el-button>
                <el-button
                  type="danger"
                  circle
                  @click="
                    prodSelected(prod);
                    show.deleteProduc = true;
                  "
                >
                  <i class="fas fa-times" aria-hidden="true"></i>
                </el-button>
              </div>
            </el-card>
          </div>
          <div class="mt-3" style="margin-left: -12px">
            <el-pagination
              v-model:currentPage="currentPageLocal"
              small
              background
              layout="prev, pager, next"
              :total="totalRows"
              :page-size="perPage"
            />
          </div>
        </div>
      </div>
      <!-- eslint-disable  vue/component-name-in-template-casing -->
      <AddEditProdMovile :title="title" :mostrar=show></AddEditProdMovile>
      <!-- 
        <ConfirmarTransacciones :show=show></ConfirmarTransacciones>
        <EliminarProdMovil :show=show></EliminarProdMovil>
        <FiltrosProductos :show=show></FiltrosProductos> 
      -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ProductosIndex',
  components: {
    AddEditProdMovile: () => import('@/components/Productos/AddEditProdMovile.vue'),
    // ConfirmarTransacciones: () => import('@/components/Productos/ConfirmarTransacciones.vue'),
    // EliminarProdMovil: () => import('@/components/Productos/EliminarProdMovil.vue'),
    // FiltrosProductos: () => import('@/components/Productos/FiltrosProductos.vue'),
  },
  data() {
    return {
      displayOption: '',
      searchDisplay: '',
      tab: '',
      title: 'Editar',
      currentPageLocal: 1,
      show: {
        addEditProdMovile: false,
        modalFiltros: false,
        deleteProduc: false,
      },
    };
  },
  computed: {
    ...mapState('productos', [
      'productos',
      'producto',
      'cacheEditProd',
      'editedProd',
      'newProd',
      'deleteTransaction',
      'editTransaction',
      'numeroDeEditados',
      'newProductMobile',
      'currentPage',
      'perPage',
      'totalRows',
      'filtroCategorias',
      'filtroMarcas',
      'filtroNombre',
      'filtroUPC',
    ]),
    ...mapState('categorias', ['categorias']),
    allFilters() {
      console.log('allFilters');
      const categories = this.filtroCategorias.map((cat) => cat.nombreCategoria);
      const brands = this.filtroMarcas.map((marca) => marca.nombreMarca);
      if (this.filtroNombre) {
        categories.push(this.filtroNombre);
      }
      if (this.filtroUPC) {
        categories.push(this.filtroUPC);
      }
      return categories.concat(brands);
    },
  },
  watch: {
    currentPageLocal(valor) {
      this.setPage(valor);
    },
    currentPage(valor) {
      this.currentPageLocal = valor;
    },
  },
  methods: {
    ...mapMutations('productos', [
      'clearData',
      'removeRegistro',
      'editProd',
      'saveEditProd',
      'undoEditProd',
      'transactionRemove',
      'addProd',
      'removeNewRegistro',
      'saveNewProduct',
      'editNewRegistro',
      'prodSelected',
    ]),
    ...mapActions('productos', ['setPage']),

    filtro(valor) {
      if (this.searchDisplay.trim() === '') return true;
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
      this.prodSelected({});
      this.title = 'Agregar producto';
      this.show.addEditProdMovile = true;
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
.image {
  width: 100%;
  max-height: 7.5rem;
  object-fit: cover;
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
</style>
