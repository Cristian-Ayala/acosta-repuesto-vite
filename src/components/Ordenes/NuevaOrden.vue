<!-- eslint-disable vue/v-on-function-call -->
<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <el-dialog
    v-model="show.detOrden"
    title="Nueva Orden"
    width="90%"
    fullscreen
    destroy-on-close
    :before-close="modalWillHide"
  >
    <template v-if="paso === 'productos'" #modal-header>
      <a class="ltStepBack" @click="paso = 'datos'"> &lt; </a>
      <h4 class="d-flex align-items-center">
        <b>Nueva Orden</b>
      </h4>
    </template>
    <div class="cuerpoModal">
      <div class="bodyMenu">
        <div v-if="paso === 'datos'" class="datosPersonales">
          <!-- :model="sizeForm" -->
          <el-form
            ref="formDatos"
            label-width="auto"
            label-position="top"
            size="default"
          >
            <el-form-item label="Fecha y hora de venta:">
              <el-date-picker
                v-model="date"
                type="datetime"
                placeholder="Seleccione una fecha y hora"
              />
            </el-form-item>
            <el-form-item label="Nombre:">
              <el-input id="nombre" v-model="orden.nombreCliente" placeholder="" />
            </el-form-item>
            <el-form-item label="Teléfono:">
              <el-input id="nombre" v-model="orden.telefono" placeholder="" />
            </el-form-item>
            <el-form-item label="Descripción:">
              <el-input v-model="orden.observacionesOrden" type="textarea" />
            </el-form-item>
            <el-form-item label="Tipo de orden:">
              <el-select
                id="tipoOrdenSelection"
                v-model="tipoDeOrden.selected"
                placeholder="Select"
                size="large"
              >
                <el-option
                  v-for="(item, index) in dropDownTypeOfOrder"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Tipo de Distribución:">
              <el-select
                id="tipoDistribucionDropDown"
                v-model="tipoDistribucion.selected"
                placeholder="Select"
                size="large"
              >
                <el-option
                  v-for="(item, index) in tipoDistribucionArray"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <blockquote>
            <p><b>Público:</b> Todos los clientes.</p>

            <p>
              <b>Mayorista:</b> Cuando la compra de productos excede lo
              normal.
            </p>

            <p>
              <b>Taller:</b> Cuando un taller asociado realiza una compra.
            </p>
          </blockquote>
        </div>
        <div v-show="paso === 'productos'" class="selProductos">
          <div>
            <input
              v-model.trim="searchProductKeyword"
              type="search"
              placeholder="Buscar"
            >
            <p>Productos encontrados ({{ prodSearchInOrdtotRows }})</p>
          </div>
          <!-- Aquí tienen que ir los productos -->
          <table class="table card-text">
            <tbody v-if="findProductos">
              <find-productos
                v-for="(prod, index) in findProductos"
                :key="prod._id"
                :prod="prod"
                :index="index"
                :orden-detalle-productos="ordenDetalleProductos"
                :tipo-dist="tipoDistribucion.selected"
                @addTmpProducts="addTmpProducts"
                @reCalculateSubTotal="reCalculateSubTotal"
              ></find-productos>
            </tbody>
          </table>
          <div class="endPagination">
            <!-- page-size is lower than total rows, so pagination will be shown -->
            <el-pagination
              layout="prev, pager, next"
              :page-size="paginator.pageSize"
              :current-page="paginator.currentPage"
              :total="prodSearchInOrdtotRows"
              :hide-on-single-page="true"
              @current-change="handleChangePage($event)"
            />
          </div>
        </div>
        <div v-if="paso === 'resumen'" class="resumenClass">
          <h3 class="pl-2" style="text-align: center;padding: 1rem 0;">Resumen de la orden</h3>
          <table class="table card-text">
            <tbody v-if="ordenDetalleProductos">
              <resumen-nueva-orden
                v-for="(prod, index) in Object.values(ordenDetalleProductos)"
                :key="prod.id"
                :prod="prod"
                :index-for-component="index"
                :orden-detalle-productos="ordenDetalleProductos"
                @addTmpProducts="addTmpProducts"
              />
              <div style="text-align: center;margin: 2rem 0;">
                Total:
                <h5 style="display: inline;">${{ total }}</h5>
              </div>
            </tbody>
          </table>
          <el-divider />
          <h3 class="pl-2" style="text-align: center;padding: 1rem 0;">Método de pago</h3>
          <div id="metPagoDropdown">
            <el-select
              id="tipoDistribucionDropDown"
              v-model="dropDownMetodoPago.selected"
              class="m-2"
              placeholder="Select"
              size="large"
            >
              <el-option
                v-for="(item, index) in dropDownMetodoPago.data"
                :key="index"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <div v-if="paso === 'datos'" class="customFooter">
          <b style="display:none;">{{renderFooter()}}</b>
          <el-button @click="show.detOrden = false">Cancelar</el-button>
          <el-button type="primary" @click="paso = 'productos'">Siguiente</el-button>
        </div>
        <div v-else-if="paso === 'productos'" class="total">
          <div>
            Total:
            <h5 style="display: inline">${{ total }}</h5>
          </div>
          <el-button
            type="primary"
            class="active rounded"
            :disabled="total <= 0"
            @click="paso = 'resumen'"
          >Siguiente</el-button>
        </div>
        <div v-else-if="paso === 'resumen'" class="customFooter">
          <el-button @click="paso = 'productos'">Atras</el-button>
          <el-button
            type="success"
            :disabled="total <= 0"
            @click="createOrder();paso = 'datos';"
          >Pagar</el-button>
        </div>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import FindProductos from '@/components/Ordenes/FindProductos.vue';
import ResumenNuevaOrden from './ResumenNuevaOrden.vue';

// Variables for upc barcode scanner
let code = '';
let reading = false;

function todayDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();
  const horas = today.getHours();
  const minutos = today.getMinutes();
  return `${mm}-${dd}-${yyyy} ${horas}:${minutos}`;
}
function twoDecimalsOnly(value) {
  try {
    return Math.round(value * 100) / 100;
  } catch (error) {
    console.log(error);
    return 0.0;
  }
}

function initialState() {
  return {
      orden: {
        nombreCliente: '',
        observacionesOrden: '',
      },
      paso: 'datos',
      date: '20-01-2021 14:30',
      tipoDistribucionArray: [
        {
          name: 'Público',
        },
        {
          name: 'Mayoreo',
        },
        {
          name: 'Taller',
        },
      ],
      tipoDistribucion: {
        selected: 'Público',
      },
      tipoDeOrden: {
        selected: 'Local',
      },
      dropDownTypeOfOrder: [{ name: 'Local' }, { name: 'Delivery' }],
      dropDownMetodoPago: {
        data: [{
            'name': 'Tarjeta de Crédito'
        }, {
            'name': 'Tarjeta de Débito'
        }, {
            'name': 'Efectivo'
        }, {
            'name': 'Credito Fiscal'
        }, {
            'name': 'Criptomoneda'
        }],
        selected: 'Efectivo'
      },
      searchProductKeyword: '',
      ordenDetalleProductos: {},
      total: 0.0,
      paginator: {
        pageSize: 10,
        currentPage: 1,
      },
      findProductos: null,
      searchTimeout: null,
    };
}

export default {
  name: 'NuevaOrden',
  components: {
    // dropdown,
    FindProductos,
    ResumenNuevaOrden,
  },
  props: {
    show: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['clearOrderFilters'],
  data() {
    return initialState();
  },
  computed: {
    ...mapState('ordenes', [
      'ordSelected',
      'showDetOrd',
      'metPago',
      'prodSearch',
      'currentPage',
    ]),
    ...mapState('productos', ['productos', 'prodSearchInOrdtotRows']),
  },
  watch: {
    searchProductKeyword () {
      // call method after 2 seconds and restart counter if called again
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.paginator.currentPage = 1;
        this.searchProductosLocal();
      }, 500);
    },
    'paginator.currentPage': function currentPageWatch() {
      this.searchProductosLocal();
    },
  },
  mounted() {
    this.date = todayDate();
    this.modalIsActive();
  },
  methods: {
    renderFooter() {
      try {
        this.$nextTick(() => {
          document.querySelector('footer.el-dialog__footer').style.setProperty('padding', '0px');
        });
      } catch (err) {
        if (!err) window.console.error('err', err);
      }
    },
    ...mapMutations('ordenes', [
      'change',
      'decProducto',
      'incProducto',
      'filtroProd',
      'dosDecimalesProd',
    ]),
    ...mapActions('productos', ['searchProductos']),
    ...mapActions('ordenes', ['createRegistroOrdenes']),
    async searchProductosLocal() {
      const {pageSize, currentPage} = this.paginator;
      const searchVariables = {
        skip: pageSize * (currentPage - 1),
        limit: pageSize,
        keyword: this.searchProductKeyword,
        pagination: {
          page: currentPage,
        }
      }
      const res = await this.searchProductos(searchVariables);
      this.findProductos = [];
      this.$nextTick(() => {
        if (res.length > pageSize) this.findProductos = res.slice(0, pageSize);
        else this.findProductos = res;
      });
    },
    reCalculateSubTotal(index, prod) {
      const tmpProd = { ...prod };
      if (!this.ordenDetalleProductos[prod?.upc] ) return;
      if (prod.price == null || typeof(prod.price) !== 'number' || prod.price <= 0) {
        tmpProd.price = 0;
      }
      tmpProd.subtotal = twoDecimalsOnly(prod.cantidad * prod.price);
      this.ordenDetalleProductos[prod.upc] = { ...tmpProd };
      this.reRender(index);
      this.calculateTotal();
    },
    addTmpProducts(product, index, add = true, triggeredFromComponent = false) {
      if (!product) return;
      let prod;
      // Check if product is already in the dictionary
      if (this.ordenDetalleProductos[product?.upc]) {
        // True: modify by 1 the quantity and update the total. Whether you add or decrease quantity
        prod = this.ordenDetalleProductos[product.upc];
        if (add) {
          // check if quantity is in stock range
          if (prod.cantidad <= prod.stockProd) prod.cantidad += 1;
        } else if (prod.cantidad >= 1) prod.cantidad -= 1;
        prod.subtotal = twoDecimalsOnly(prod.cantidad * prod.price);
      } else {
        if (!add) return; // substrac from 0 is not allowed
        // False: add the product to the dictionary
        prod = {
          ...product,
          cantidad: 1,
          subtotal: twoDecimalsOnly(product.price),
        };
      }
      delete prod.foto;
      this.ordenDetalleProductos[prod.upc] = { ...prod };
      if (triggeredFromComponent) {
        // Index is returned as the UPC of the product
        Object.assign(this.ordenDetalleProductos[prod.upc], { ...prod });
      } else {
        this.reRender(index);
      }
      this.calculateTotal();
    },
    reRender(index) {
      this.findProductos[index]._id += 'a';
    },
    calculateTotal() {
      try {
        let total = 0.0;
        Object.values(this.ordenDetalleProductos).forEach((prod) => {
          total += twoDecimalsOnly(prod.subtotal);
        });
        this.total = twoDecimalsOnly(total);
      } catch (error) {
        console.log(error);
      }
    },
    async createOrder() {
      const localOrder = { ...this.orden };
      delete localOrder.totalOrden;
      const orden = {
        _id: `${new Date(this.date).toISOString().slice(0, -7)}${new Date().toISOString().slice(17)}`,
        metodoPago: this.dropDownMetodoPago.selected,
        tipoDistribucion: this.tipoDistribucion.selected,
        totalOrden: this.total,
        productos: Object.values(this.ordenDetalleProductos),
        status: this.tipoDeOrden.selected === 'Local' ? 'Completado' : 'En proceso',
        tipoOrden: this.tipoDeOrden.selected,
        ...localOrder
      };
      await this.createRegistroOrdenes(orden);
      this.$emit('clearOrderFilters');
      this.clearData();
      // eslint-disable-next-line
      this.show.detOrden = false;
    },
    clearData() {
      Object.assign(this.$data, initialState());
    },
    modalIsActive() {
      document.addEventListener('keypress', this.listenerFunction);
    },
    modalWillHide() {
      // eslint-disable-next-line
      this.show.detOrden = false;
      document.removeEventListener('keypress', this.listenerFunction);
      this.clearData();
    },
    listenerFunction(e) {
      // usually scanners throw an 'Enter' key at the end of read
      if (e.key === 'Enter') {
        if (code.length > 10) {
          this.searchProductKeyword = code;
          console.log(code);
          /// code ready to use
          code = '';
        }
      } else {
        code += e.key; // while this is not an 'enter' it stores the every key
      }
      // run a timeout of 200ms at the first read and clear everything
      if (!reading) {
        reading = true;
        setTimeout(() => {
          code = '';
          reading = false;
        }, 200); // 200 works fine for me but you can adjust it
      }
    },
    handleChangePage(currentPage) {
      this.paginator.currentPage = currentPage;
    },
  },
};
</script>

<style scoped>
.button-product {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
  background-color: #fff;
  color: #28a745;
}
:deep(p) {
  margin-top: 0;
  margin-bottom: 0;
}
:deep(.modal-dialog) {
  max-width: 100% !important;
  height: 100%;
  margin: 0;
  padding: 0 !important;
  overflow-y: initial !important;
}

:deep(.modal-content) {
  height: 100% !important;
}
:deep(.modal-body) {
  height: 80vh;
  overflow-y: auto;
}
:deep(.bg-success) {
  background-image: radial-gradient(
    circle farthest-corner at 50.4% 50.5%,
    #0eae57 0%,
    rgb(0 123 57) 90%
  );
}
:deep(.modal-header) {
  /* box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%); */
  box-shadow: 13rem 0rem 0.8rem rgb(0 0 0 / 10%);
}
:deep(.modal-footer) {
  /* box-shadow: 0.125rem -0.8rem 20px 0px rgb(0 0 0 / 10%); */
  box-shadow: 13rem -0.8rem 20px 0px rgb(0 0 0 / 10%);
}
:deep(.modal-title) {
  padding-left: 2.5rem;
}
.roundedBorder {
  border-radius: calc(1rem - 1px) calc(1rem - 1px) 0 0;
}
/* para el dropdown */
:deep(.dropdown-menu > li > a:hover) {
  background: #efefef;
  color: #002696;
}
:deep(.dropdown-menu) {
  display: block;
}
:deep(li.dropdown-toggle::after) {
  display: none;
}
/* Body del modal */
:deep(.modal-body) {
  padding: 0%;
}
.cuerpoModal {
  display: inline;
  padding: 0%;
}
:deep(.list-group-item) {
  transition: none;
  border: none;
  cursor: pointer;
  user-select: none;
}
.sideBarMenu {
  display: inline-flex;
  height: 100%;
  width: 13rem;
  align-items: center;
  padding: 0;
  margin: 0;
  border-right: 1px solid #dfdfdf;
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
}
.bodyMenu {
  height: 100%;
  vertical-align: top;
  position: relative;
}
.tabSelected {
  transition: 0.1s ease-in-out all !important;
  border-right: 0.5rem solid #28a745;
}
.datosPersonales {
  width: 100%;
}
:deep(.vdpComponent input[type="text"]) {
  text-align: center;
  font-size: medium;
  font-family: revert;
  /* font-weight: bold; */
  padding: 0.4rem 0.8rem;
  line-height: 1.5;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 2rem;
  -webkit-transition: border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
}
.justifySpace {
  justify-content: space-between;
  width: 100%;
}
.fechaForm {
  float: right;
  margin: 1rem;
}
.dropdown {
  text-align: center;
}
blockquote {
  color: rgba(0, 0, 0, 0.5);
  padding-left: 0.5em;
  border-left: 5px solid rgba(0, 0, 0, 0.1);
}
.selProductos {
  width: 100%;
  height: 100%;
  padding: 0;
  background: transparent;
}
/* search input */
input {
  outline: none;
}
input[type="search"] {
  margin-bottom: 1rem;
  -webkit-appearance: textfield;
  appearance: textfield;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  font-family: inherit;
  font-size: 100%;
}
input::-webkit-search-decoration,
input::-webkit-search-cancel-button {
  display: none;
}

input[type="search"] {
  background: #ededed
    url(https://static.tumblr.com/ftv85bp/MIXmud4tx/search-icon.png) no-repeat
    9px center;
  border: solid 1px #ccc;
  padding: 9px 10px 9px 32px;
  width: 55vw;

  -webkit-border-radius: 10em;
  -moz-border-radius: 10em;
  border-radius: 10em;

  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}
input[type="search"]:focus {
  width: 70vw;
  background-color: #fff;
  border-color: #cc6666;

  -webkit-box-shadow: 0 0 5px rgba(246, 109, 109, 0.5);
  -moz-box-shadow: 0 0 5px rgba(246, 109, 109, 0.5);
  box-shadow: 0 0 5px rgba(246, 109, 109, 0.5);
}

input:-moz-placeholder {
  color: #999;
}
input::-webkit-input-placeholder {
  color: #999;
}
/* fin del search input */
/* inicio del spinbuttom */
:deep(.b-form-spinbutton.form-control.d-flex.align-items-stretch button) {
  color: black;
  padding: 0.3rem;
  transition: all 0.5s ease;
}

:deep(.b-form-spinbutton .btn:not([class*="outline"]):hove) ,
:deep(.b-form-spinbutton .btn:not([class*="outline"]):focus) {
  color: #000 !important;
  font-size: large;
}
:deep(.b-form-spinbutton output) {
  padding: 0;
}
/* fin del spinbuttom */
.descuento {
  max-width: 5rem;
}

/* Fin del body del modal */
.stepBack {
  background-color: #0d2818;
  border-color: #0d2818;
  color: #fff;
  margin: 0 1rem;
}
.endPagination {
  display: flex;
  justify-content: space-evenly;
  padding-bottom: 1rem;
}

:deep(tr) {
  background-color: #fff;
  margin: 0.5rem 0;
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
}
.ltStepBack {
  height: 100%;
  display: flex;
  align-items: center;
  font-size: x-large;
  background: transparent;
}
.total {
  background-color: var(--el-color-primary-dark-2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}
:deep(.modal-footer) {
  padding: 0%;
  width: 100%;
  display: block;
}
.customFooter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}
#metPagoDropdown {
  text-align: center;
}
:global(footer.el-dialog__footer) {
  margin-top: auto;
}
:global(.el-dialog.is-fullscreen) {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100vh;
}
/* .el-radio-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, auto);
    gap: 0.5rem;
    align-items: center;
} */
</style>