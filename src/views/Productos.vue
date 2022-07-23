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
              <el-button color="#28a745" @click="prodSelected({});title = 'Agregar producto';show.addEditProdMovile =true;" circle>
                <i class="fa fa-plus" aria-hidden="true"></i>
              </el-button>
            </div>
            <div class="filtros">
              <div class="d-inline-flex pr-2 pb-2">
                <el-button type="primary" round @click="show.modalFiltros">Filtros ({{ allFilters.length }})</el-button>
              </div>
              <div
                class="d-inline-flex auto-scroll pb-2"
                v-if="allFilters && allFilters.length > 0"
              >
                <el-button
                  type="primary"
                  round
                  v-for="filter in allFilters"
                  :key="filter"
                  disabled
                  @click="show.modalFiltros"
                  class="btn-sm pr-2 pl-2"
                  >
                    {{ filter }}
                </el-button>
              </div>
            </div>
          </div>
          <el-card 
            :body-style="{ padding: '0px' }"
            v-for="prod in productos"
            :key="prod.upc"
            >
            <img
              :src="prod.doc.foto"
              class="image"
            />
            <div style="padding: 14px">
              <span>{{ prod.doc.nombreProd }}</span>
              <div class="bottom">
                UPC: {{ prod.doc.upc }}<br />
                P.M.: <b>${{ prod.doc.precioMayoreo }}</b
                ><br />
                P.P.: <b>${{ prod.doc.precioPublico }}</b
                ><br />
                P.T.: <b>${{ prod.doc.precioTaller }}</b
                ><br />
                Stock: {{ prod.doc.stockProd }}<br />
                Marca: {{ prod.doc.nombreMarca }}<br />
                Categoria: {{ prod.doc.nombreCategoria }}<br />
              </div>
              <el-button type="warning" @click="prodSelected(prod);title = 'Editar producto';show.addEditProdMovile = true" circle>
                <i class="fas fa-pencil-alt" aria-hidden="true"/>
              </el-button>
              <el-button type="danger" @click="prodSelected(prod);show.deleteProduc = true" circle>
                <i class="fas fa-times" aria-hidden="true"/>
              </el-button>
            </div>
          </el-card>        
          <div style="padding: 1rem">
            <div class="mt-3">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="totalRows"
                :page-size="perPage"
                v-model:currentPage="currentPageLocal"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- <ConfirmarTransacciones :show=show></ConfirmarTransacciones>
      <EliminarProdMovil :show=show></EliminarProdMovil>
      <AddEditProdMovile :title="title" :show=show></AddEditProdMovile>
      <FiltrosProductos :show=show></FiltrosProductos> -->
    </div>
  </div>
</template>

<script>
import ConfirmarTransacciones from "@/components/Productos/ConfirmarTransacciones.vue";
import EliminarProdMovil from "@/components/Productos/EliminarProdMovil.vue";
import AddEditProdMovile from "@/components/Productos/AddEditProdMovile.vue";
import FiltrosProductos from "@/components/Productos/FiltrosProductos.vue";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "Productos",
  components: {
    ConfirmarTransacciones,
    EliminarProdMovil,
    AddEditProdMovile,
    FiltrosProductos,
  },
  data: () => {
    return {
      displayOption: "",
      searchDisplay: "",
      tab: "",
      title: "Editar",
      currentPageLocal: 1,
      show: {
        addEditProdMovile: false, 
        modalFiltros: false,
        deleteProduc: false,
      }
    };
  },
  methods: {
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
      "prodSelected",
    ]),
    ...mapActions("productos", ["setPage"]),

    filtro(valor) {
      if (this.searchDisplay.trim() === "") return true;
      let array = (
        this.productos[valor].nombreProd +
        this.productos[valor].descripcion +
        this.productos[valor].precioUnit +
        this.productos[valor].stockProd +
        this.productos[valor].upc
      ).toUpperCase();
      return array.indexOf(this.searchDisplay.toUpperCase()) >= 0;
    },
  },
  computed: {
    ...mapState("productos", [
      "productos",
      "producto",
      "cacheEditProd",
      "editedProd",
      "newProd",
      "deleteTransaction",
      "editTransaction",
      "numeroDeEditados",
      "newProductMobile",
      "currentPage",
      "perPage",
      "totalRows",
      "filtroCategorias",
      "filtroMarcas",
      "filtroNombre",
      "filtroUPC",
    ]),
    ...mapState("categorias", ["categorias"]),
    // funcion que evalua si hay algun dato en cache para que el boton de "Aplicar Cambios" se muestre
    applyChanges: function () {
      let nuevosProductos = this.newProd.filter((prod) => prod.state === 1);
      if (nuevosProductos.length > 0) {
        return true;
      }

      if (this.deleteTransaction.length > 0) {
        return true;
      }

      if (this.editTransaction.length > 0) {
        return true;
      }

      return false;
    },
    allFilters: function () {
      let categories = this.filtroCategorias.map((cat) => cat.nombreCategoria);
      let brands = this.filtroMarcas.map((marca) => marca.nombreMarca);
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
    currentPageLocal: function (valor) {
      this.setPage(valor);
    },
    currentPage: function (valor) {
      this.currentPageLocal = valor;
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
</style>