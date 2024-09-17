<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <el-dialog
    v-model="show.newOrder"
    title="Nueva Orden"
    width="90%"
    fullscreen
    destroy-on-close
    :before-close="modalWillHide"
  >
    <div class="cuerpoModal">
      <div class="bodyMenu">
        <div v-if="paso === 'datos'" class="datosPersonales">
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
              <el-select
                id="nombre"
                v-model="orden.cliente_id"
                placeholder="Seleccione un cliente"
                filterable
                clearable
                :loading="loading.clientes"
                @input="clientSearch"
              >
                <el-option
                  v-for="client in clientes"
                  :key="client?.id || 0"
                  :label="`${client.name} ${client.last_name}`"
                  :value="client.id"
                >
                  <span>{{ `${client.name} ${client.last_name}` }}</span>
                </el-option>
                <div class="plusWrapper">
                  <el-button
                    type="success"
                    circle
                    @click="show.modalAddEditClient = true"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-button>
                </div>
              </el-select>
            </el-form-item>
            <el-form-item label="Descripción:">
              <el-input v-model="orden.observaciones_orden" type="textarea" />
            </el-form-item>
            <el-form-item label="Tipo de orden:">
              <el-select
                id="tipoOrdenSelection"
                v-model="orden.tipo_orden_id"
                placeholder="Select"
                size="large"
              >
                <el-option
                  v-for="item in dropDownTypeOfOrder"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Tipo de Distribución:">
              <el-select
                id="tipoDistribucionDropDown"
                v-model="orden.tipo_distribucion_id"
                placeholder="Select"
                size="large"
              >
                <el-option
                  v-for="item in tipoDistribucionArray"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <blockquote>
            <p><b>Público:</b> Todos los clientes.</p>

            <p>
              <b>Mayorista:</b> Cuando la compra de productos excede lo normal.
            </p>

            <p><b>Taller:</b> Cuando un taller asociado realiza una compra.</p>
          </blockquote>
        </div>

        <div v-if="paso === 'resumen'" class="resumenClass">
          <h3 class="pl-2" style="text-align: center; padding: 1rem 0">
            Resumen de la orden
          </h3>
          <table class="table card-text">
            <tbody v-if="ordenDetalleProductos">
              <resumen-nueva-orden
                v-for="prod in Object.values(ordenDetalleProductos)"
                :key="prod.id"
                :prod="prod"
              />
              <div style="text-align: center; margin: 2rem 0">
                Total:
                <h5 style="display: inline">${{ total }}</h5>
              </div>
            </tbody>
          </table>
          <el-divider />
          <h3 class="pl-2" style="text-align: center; padding: 1rem 0">
            Método de pago
          </h3>
          <div id="metPagoDropdown">
            <el-select
              id="metPagoDropdown"
              v-model="orden.metodo_pago_id"
              class="m-2"
              placeholder="Select"
              size="large"
            >
              <el-option
                v-for="item in dropDownMetodoPago"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div
            v-if="orden.metodo_pago_id === 17"
            class="text-center"
            style="padding-top: 1rem"
          >
            <h6>¿Cuánto dinero recibe?</h6>
            <el-input-number
              v-model="amount_payed"
              :precision="2"
              :min="total"
            />
            <div>Vuelto: ${{ vuelto }}</div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <div v-if="paso === 'resumen'" class="customFooter">
          <el-button
            type="success"
            :disabled="total <= 0"
            @click="paso = 'datos'"
          >
            Siguiente
          </el-button>
        </div>
        <div v-else-if="paso === 'datos'" class="customFooter">
          <b style="display: none">{{ renderFooter() }}</b>
          <el-button @click="paso = 'resumen'">Atras</el-button>
          <el-button
            type="primary"
            @click="
              paso = 'resumen';
              createOrder();
            "
          >
            Finalizar
          </el-button>
        </div>
      </span>
    </template>
  </el-dialog>
  <create-edit-client
    title="Crear Cliente"
    :mostrar="show"
    :client-selected="{ CLEAR: true }"
    @close-modal-and-refresh="closeModalAndRefresh"
  ></create-edit-client>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ResumenNuevaOrden from "./ResumenNuevaOrden.vue";
import CreateEditClient from "@/components/Clientes/CreateEditClient.vue";

function todayDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = today.getFullYear();
  const horas = today.getHours();
  const minutos = today.getMinutes();
  return `${mm}-${dd}-${yyyy} ${horas}:${minutos}`;
}

function initialState() {
  return {
    orden: {
      cliente_id: 1, // Por defecto
      observaciones_orden: "",
      metodo_pago_id: null,
      tipo_distribucion_id: null,
      tipo_orden_id: null,
    },
    amount_payed: 0,
    paso: "resumen",
    date: "20-01-2021 14:30",
    defaultClient: {
      id: 1,
      name: "Usuario Por",
      last_name: "Defecto",
    },
    userOrganization: null,
    loading: {
      clientes: false,
    },
    clientes: [],
    debounceTimer: null,
  };
}

export default {
  name: "NuevaOrden",
  components: {
    // dropdown,
    ResumenNuevaOrden,
    CreateEditClient,
  },
  props: {
    show: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["clearOrderFilters"],
  data() {
    return initialState();
  },
  computed: {
    ...mapState("ordenes", [
      "tipoDistribucionArray",
      "dropDownTypeOfOrder",
      "dropDownMetodoPago",
      "enums",
    ]),
    ...mapState("productos", ["ordenDetalleProductos"]),
    ...mapState("auth", ["userProfile"]),
    total() {
      let total = 0.0;
      Object.values(this.ordenDetalleProductos).forEach((prod) => {
        total += prod.subtotal;
      });
      return this.$twoDecimalsOnly(total);
    },
    vuelto() {
      return this.$twoDecimalsOnly(this.amount_payed - this.total);
    },
  },
  watch: {
    enums: {
      handler(enums) {
        if (!enums) return;
        this.orden.metodo_pago_id = enums.PAY_METHOD.EFECTIVO.id;
        this.orden.tipo_distribucion_id = enums.DIST_TYPE.PUBLICO.id;
        this.orden.tipo_orden_id = enums.ORD_TYPE.LOCAL.id;
      },
      immediate: true,
    },
  },
  async mounted() {
    this.clientes = [this.defaultClient];
    this.userOrganization = this.userProfile?.locationSelected;
    this.date = todayDate();
  },
  methods: {
    renderFooter() {
      try {
        this.$nextTick(() => {
          document
            .querySelector("footer.el-dialog__footer")
            .style.setProperty("padding", "0px");
        });
      } catch (err) {
        if (!err) window.console.error("err", err);
      }
    },
    ...mapActions("ordenes", ["createRegistroOrdenes"]),
    async createOrder() {
      const loading = this.$loading({ fullscreen: true });
      try {
        const orderType = this.dropDownTypeOfOrder.find(
          (item) => item.id === this.orden.tipo_orden_id,
        );
        if (!orderType) {
          loading.close();
          return;
        }
        const order = {
          status_id: orderType.code,
          total_orden: this.total,
          cede: this.userProfile?.locationSelected,
          ...this.orden,
        };
        const resCreation = await this.createRegistroOrdenes({
          order,
          prodByOrder: Object.values(this.ordenDetalleProductos),
        });
        if (resCreation === "JWTExpired") {
          this.$router.push({ name: "Login" });
          loading.close();
          return;
        }
        // this.$emit("clearOrderFilters");
        // eslint-disable-next-line
        this.show.newOrder = false;
        this.clearData();
        this.$router.push({ name: "Ordenes" });
        loading.close();
      } catch (error) {
        loading.close();
        window.console.error(error);
      }
    },
    clearData() {
      Object.assign(this.$data, initialState());
    },
    modalWillHide() {
      // eslint-disable-next-line
      this.show.newOrder = false;
      this.clearData();
    },
    async getClientes(keyword) {
      if (!keyword || keyword.trim() === "") {
        this.clientes = [this.defaultClient];
        return;
      }
      this.loading.clientes = true;
      const res = await this.$store.dispatch("clientes/getAll", {
        keyword: `%${keyword}%`,
      });
      this.clientes = res.clientes;
      this.loading.clientes = false;
    },
    closeModalAndRefresh(client) {
      /* eslint-disable vue/no-mutating-props */
      this.orden.cliente_id = client?.id;
      this.show.modalAddEditClient = false;
      if (!client) return;
      this.clientes = [client];
      this.orden.cliente_id = client?.id;
      this.getClientes();
    },
    clientSearch(event) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.getClientes(event.target.value);
      }, 500);
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
  -webkit-transition:
    border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition:
    border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out,
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

:deep(.b-form-spinbutton .btn:not([class*="outline"]):hove),
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
:deep(.el-select) {
  width: 100%;
}
.plusWrapper {
  display: flex;
  place-content: center;
  border-top: 1px solid #cfcfcf;
  padding: 0.5rem 0;
}
</style>
