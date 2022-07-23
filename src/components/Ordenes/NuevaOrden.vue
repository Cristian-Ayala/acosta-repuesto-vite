<template>
  <div>
    <b-modal id="nuevaOrden" centered title="Nueva Orden" @show="modalIsActive" @hide="modalWillHide">
      <template v-slot:modal-header v-if="paso === 'productos'">
        <a class="ltStepBack" @click="paso = 'datos'"> &lt; </a>
        <h4 class="d-flex align-items-center">
          <b>Nueva Orden</b>
        </h4>
      </template>
      <div class="cuerpoModal">
        <div class="bodyMenu">
          <div class="datosPersonales" v-if="paso === 'datos'">
            <b-form class="d-flex justify-content-center mb-4 mt-4 ml-3" inline>
              <label for="fecha">Fecha de venta:&nbsp;&nbsp;&nbsp; </label>
              <date-pick
                id="fecha"
                v-model="date"
                :inputAttributes="{ readonly: true }"
                :pickTime="true"
                :use12HourClock="true"
                :format="'MM-DD-YYYY HH:mm'"
                :displayFormat="'DD-MM-YYYY H:mm A'"
                :selectableYearRange="{ from: 2020, to: 2050 }"
              ></date-pick>
            </b-form>
            <b-form class="justifySpace ml-3" inline>
              <div>
                <label for="nombre">Nombre:&nbsp;&nbsp;&nbsp; </label>
                <b-form-input
                  id="nombre"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  v-model="orden.nombreCliente"
                ></b-form-input>
              </div>
              <div>
                <label for="tel">Teléfono:&nbsp;&nbsp;&nbsp; </label>
                <b-form-input
                  id="tel"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  v-model="orden.telefono"
                ></b-form-input>
              </div>
              <div>
                <label for="tel">Descripción:&nbsp;&nbsp;&nbsp; </label>
                <b-form-textarea
                  id="textareaDesc"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  v-model="orden.observacionesOrden"
                  rows="3"
                  max-rows="6"
                ></b-form-textarea>
              </div>
            </b-form>
            <b-form class="d-flex justify-content-center mb-4 mt-5" inline>
              <div>
                <label for="tipoOrdenSelection"
                  >Tipo de orden:&nbsp;&nbsp;&nbsp;
                </label>
                <!-- <dropdown
                  id="tipoOrdenSelection"
                  class="dropdown"
                  :options="dropDownTypeOfOrder.data"
                  :selected="dropDownTypeOfOrder.selected"
                  v-on:updateOption="(payload) => dropDownTypeOfOrder.selected = payload"
                  :placeholder="dropDownTypeOfOrder.data[0].name"
                  :closeOnOutsideClick="true"
                >
                </dropdown> -->
              </div>
              <div>
                <label for="tipoDistribucionDropDown"
                  >Tipo de Distribución:&nbsp;&nbsp;&nbsp;
                </label>
                <!-- <dropdown
                  id="tipoDistribucionDropDown"
                  class="dropdown"
                  :options="tipoDistribucionArray"
                  :selected="tipoDistribucion"
                  v-on:updateOption="(payload) => tipoDistribucion = payload"
                  :placeholder="'Público'"
                  :closeOnOutsideClick="true"
                >
                </dropdown> -->
              </div>
            </b-form>
            <div class="ml-3 pr-3">
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
          </div>
          <div class="selProductos" v-show="paso === 'productos'">
            <div class="pl-3 pt-3 pb-3">
              <input
                type="search"
                placeholder="Buscar"
                v-model="searchProduct"
              />
              <p>Productos encontrados ({{ searchTotalRows }})</p>
            </div>
            <!-- Aquí tienen que ir los productos -->
            <table class="table card-text">
              <tbody v-if="findProductos">
                <FindProductos
                  v-for="(prod, index) in findProductos"
                  :prod="prod"
                  :index="index"
                  :ordenDetalleProductos="ordenDetalleProductos"
                  :key="prod.id"
                  @addTmpProducts="addTmpProducts"
                ></FindProductos>
              </tbody>
            </table>
            <div class="endPagination">
              <b-button
                :disabled="!(currentPage > 1)"
                v-on:click="
                  paginationNavPlugin({ prevOrNext: 'prev', searchProduct })
                "
                class="btn btn-outline-success button-product"
              >
                <span> &lt; </span>
              </b-button>
              <b-button class="btn btn-outline-success button-product">
                {{ currentPage }}
              </b-button>
              <b-button
                :disabled="
                  !(this.currentPage < Math.ceil(this.searchTotalRows / 10))
                "
                v-on:click="
                  paginationNavPlugin({ prevOrNext: 'next', searchProduct })
                "
                class="btn btn-outline-success button-product"
              >
                <span> &gt; </span>
              </b-button>
            </div>
          </div>
          <div class="resumenClass" v-if="paso === 'resumen'">
            <h3 class="pl-2" style="text-align: center;padding: 1rem 0;">Resumen de la orden</h3>
            <table class="table card-text">
              <tbody v-if="ordenDetalleProductos">
                <resumen-nueva-orden
                  v-for="(prod, index) in ordenDetalleProductos"
                  :prod="prod"
                  :indexForComponent="index"
                  :ordenDetalleProductos="ordenDetalleProductos"
                  :key="prod.id"
                  @addTmpProducts="addTmpProducts"
                />
                <div style="text-align: center;margin: 2rem 0;">
                  Total:
                  <h5 style="display: inline;">${{ total }}</h5>
                </div>
              </tbody>
            </table>
          </div>
          <div class="metPago" v-if="paso === 'pago'">
            <h3 class="pl-2" style="text-align: center;padding: 1rem 0;">Método de pago</h3>
            <div style="text-align: center;margin: 2rem 0;">
              Total:
              <h5 style="display: inline;">${{ total }}</h5>
            </div>
            <div id="metPagoDropdown">
              <!-- <dropdown
                id="metPagoSelection"
                class="dropdown"
                :options="dropDownMetodoPago.data"
                :selected="dropDownMetodoPago.selected"
                v-on:updateOption="(payload) => dropDownMetodoPago.selected = payload"
                :placeholder="dropDownMetodoPago.data[0].name"
                :closeOnOutsideClick="true"
              >
              </dropdown> -->
            </div>
          </div>
        </div>
      </div>
      <template #modal-footer="{ cancel, ok }">
        <div v-if="paso === 'datos'" class="customFooter">
          <b-button size="m" variant="secondary" @click="cancel()">
            Cancelar
          </b-button>
          <b-button size="m" variant="success" @click="paso = 'productos'">
            Siguiente
          </b-button>
        </div>
        <div v-else-if="paso === 'productos'" class="total">
          <div>
            Total:
            <h5 style="display: inline">${{ total }}</h5>
          </div>
          <b-button
            size="m"
            variant="success"
            @click="paso = 'resumen'"
            class="active rounded"
            :disabled="total <= 0"
          >
            Siguiente
          </b-button>
        </div>
        <div v-else-if="paso === 'resumen'" class="customFooter">
          <b-button size="m" @click="paso = 'productos'" class="stepBack">
            Atras
          </b-button>
          <b-button
            size="m"
            variant="success"
            @click="paso = 'pago'"
            :disabled="total <= 0"
          >
            Pagar
          </b-button>
        </div>
        <div v-else-if="paso === 'pago'" class="customFooter">
          <b-button size="m" @click="paso = 'resumen'" class="stepBack">
            Atras
          </b-button>
          <b-button
            size="m"
            variant="success"
            @click="
              createOrder();
              paso = 'datos';
              ok();
            "
          >
            Confirmar
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script>
// import dropdown from "vue-dropdowns";
import DatePick from "@/components/Calendario/vueDatePick.vue";
import FindProductos from "@/components/Ordenes/FindProductos.vue";
import { mapState, mapMutations, mapActions } from "vuex";
import ResumenNuevaOrden from "./ResumenNuevaOrden.vue";

// Variables for upc barcode scanner
let code = "";
let reading = false;

export default {
  name: "NuevaOrden",
  components: {
    // dropdown,
    DatePick,
    FindProductos,
    ResumenNuevaOrden,
  },
  data() {
    return {
      paso: "datos",
      date: "20-01-2021 14:30",
      tipoDistribucionArray: [
        {
          name: "Público",
        },
        {
          name: "Mayoreo",
        },
        {
          name: "Taller",
        },
      ],
      tipoDistribucion: {
        name: "Público",
      },
      dropDownTypeOfOrder: {
        data: [{
            "name": "Local"
        }, {
            "name": "Delivery"
        }],
        selected: {
            "name": "Local"
        },
      },
      dropDownMetodoPago: {
        data: [{
            "name": "Tarjeta de Crédito"
        }, {
            "name": "Tarjeta de Débito"
        }, {
            "name": "Efectivo"
        }, {
            "name": "Credito Fiscal"
        }, {
            "name": "Criptomoneda"
        }],
        selected: {
            "name": "Efectivo"
        },
      },
      searchProduct: "",
      ordenDetalleProductos: {},
      total: 0.0,
    };
  },
  methods: {
    ...mapMutations("ordenes", [
      "change",
      "decProducto",
      "incProducto",
      "filtroProd",
      "dosDecimalesProd",
    ]),
    ...mapActions("ordenes", ["searchProductos", "paginationNavPlugin", "createRegistroOrdenes"]),
    addTmpProducts(ordenDetalleProductos, add = true, index, triggeredFromComponent = false) {
      let prod;
      //Check if product is already in the dictionary
      if (this.ordenDetalleProductos[ordenDetalleProductos?.upc]) {
        // console.log("Exist");
        //True: modify by 1 the quantity and update the total. Whether you add or decrease quantity
        prod = this.ordenDetalleProductos[ordenDetalleProductos.upc];
        if (add) {
          //check if quantity is in stock range
          if (prod.cantidad <= prod.stockProd) {
            prod.cantidad += 1;
            prod.subtotal = twoDecimalsOnly(prod.cantidad * prod.precioPublico);
          }
        } else {
          if (prod.cantidad >= 1) {
            prod.cantidad -= 1;
            prod.subtotal = twoDecimalsOnly(prod.cantidad * prod.precioPublico);
          }
        }
      } else {
        //False: add the product to the dictionary
        // console.log("does not exist");
        prod = {
          ...ordenDetalleProductos,
          cantidad: 1,
          subtotal: twoDecimalsOnly(ordenDetalleProductos.precioPublico),
        };
      }
      delete prod.foto;
      this.ordenDetalleProductos[prod.upc] = Object.assign({}, { ...prod });
      if (triggeredFromComponent) {
        console.log(ordenDetalleProductos);
        console.log(index);
        // Index is returned as the UPC of the product
        Object.assign(this.ordenDetalleProductos[prod.upc], { ...prod });
      } else {
        this.reRender(index);
      }
      this.calculateTotal();
    },
    reRender(index) {
      let render = this.findProductos[index];
      render.id = render.id + "a";
      this.$set(this.findProductos, index, render);
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
      let localOrder = { ...this.orden }
      delete localOrder.totalOrden;
      const orden = {
        _id: `${new Date(this.date).toISOString().slice(0, -7)}${new Date().toISOString().slice(17)}`,
        metodoPago: this.dropDownMetodoPago.selected.name,
        tipoDistribucion: this.tipoDistribucion.name,
        totalOrden: this.total,
        productos: Object.values(this.ordenDetalleProductos),
        status: this.dropDownTypeOfOrder.selected.name === "Local" ? "Completado" : "En proceso",
        tipoOrden: this.dropDownTypeOfOrder.selected.name, // Ir a dejar
        ...localOrder
      };
      await this.createRegistroOrdenes(orden);
      this.clearData();
    },
    clearData() {
      this.ordenDetalleProductos = {};
      this.total = 0.0;
      this.paso = "datos";
      this.orden = {
          "nombreCliente": "",
          "observacionesOrden": "",
      }
      this.searchProduct = '';
      this.searchProductos('');
    },
    modalIsActive() {
      document.addEventListener('keypress', this.listenerFunction);
    },
    modalWillHide() {
      document.removeEventListener('keypress', this.listenerFunction);
      this.clearData();
    },
    listenerFunction(e) {
      //usually scanners throw an 'Enter' key at the end of read
      if (e.key === 'Enter') {
        if (code.length > 10) {
          this.searchProduct = code;
          console.log(code);
          /// code ready to use
          code = "";
        }
      } else {
        code += e.key; //while this is not an 'enter' it stores the every key
      }
      //run a timeout of 200ms at the first read and clear everything
      if (!reading) {
        reading = true;
        setTimeout(() => {
          code = "";
          reading = false;
        }, 200); //200 works fine for me but you can adjust it
      }
    },
  },
  computed: {
    ...mapState("ordenes", [
      "ordSelected",
      "showDetOrd",
      "orden",
      "metPago",
      "prodSearch",
      "searchTotalRows",
      "findProductos",
      "currentPage",
    ]),
    ...mapState("productos", ["productos"]),
  },
  mounted() {
    this.date = todayDate();
    console.log("Mounted");
  },
  watch: {
    searchProduct: function (val) {
      // console.log("Watcheme prro", val);
      this.searchProductos(val);
    },
  },
};
function todayDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
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
  padding-left: 1.5em;
  border-left: 5px solid rgba(0, 0, 0, 0.1);
}
.selProductos {
  width: 100%;
  height: 100%;
  padding: 0 0.5rem;
  background: #f8f9fb;
}
/* search input */
input {
  outline: none;
}
input[type="search"] {
  margin-bottom: 1rem;
  -webkit-appearance: textfield;
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
  border-color: #66cc75;

  -webkit-box-shadow: 0 0 5px rgba(109, 207, 246, 0.5);
  -moz-box-shadow: 0 0 5px rgba(109, 207, 246, 0.5);
  box-shadow: 0 0 5px rgba(109, 207, 246, 0.5);
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
  background-color: #28a745;
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
.metPago {
  background-image: url(https://media0.giphy.com/media/dmmBhPUnCSF9ibuTEo/giphy.gif?cid=ecf05e47r8zkck2cj8uf4ukx8lxvo9mo5ye41w242dtjk5qi&rid=giphy.gif&ct=g);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: bottom;
  height: 100%;
}
</style>