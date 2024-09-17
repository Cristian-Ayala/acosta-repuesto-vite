<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog v-model="show.detOrd" title="Detalle Orden" fullscreen>
    <div class="card-body">
      <h5>Fecha:</h5>
      <p>{{ formatDate(ordSelected.created_at) }}</p>

      <h5 v-if="ordSelected.cliente">Nombre del cliente:</h5>
      <p v-if="ordSelected != null && ordSelected.cliente != null">
        {{ `${ordSelected?.cliente?.name} ${ordSelected?.cliente?.last_name}` }}
      </p>

      <div class="line"></div>
      <div>
        <h5>Productos:</h5>
        <!-- tabla de productos -->
        <el-table
          v-loading="loadingDetalleOrd"
          :data="productosInOrder"
          style="width: 100%"
          stripe
        >
          <!-- <el-table-column prop="upc" label="UPC" /> -->
          <el-table-column label="Nombre" width="300">
            <template #default="scope">
              {{ scope.row.producto?.nombre_producto }}
            </template>
          </el-table-column>
          <el-table-column prop="precio" label="Precio unitario" />
          <el-table-column prop="cantidad" label="Cantidad" />
          <!-- <el-table-column prop="descuento" label="Descuento" /> -->
          <el-table-column prop="sub_total" label="Sub-Total" />
        </el-table>
      </div>
      <h6 style="margin-top: 1rem; font-weight: 900; text-align: center">
        Total: {{ ordSelected.total_orden }}
      </h6>
      <div class="line"></div>
      <h5 v-if="ordSelected.observaciones_orden">Descripción:</h5>
      <p>{{ ordSelected.observaciones_orden }}</p>

      <h5>Método de pago:</h5>
      <p>{{ getMetPago(ordSelected.metodo_pago_id) }}</p>

      <h5>Tipo de orden:</h5>
      <p>{{ getTipoOrd(ordSelected.tipo_orden_id) }}</p>

      <h5>Tipo de distribución:</h5>
      <p>{{ getDistributionType(ordSelected.tipo_distribucion_id) }}</p>

      <h5>Estado:</h5>
      <p>{{ getStatus(ordSelected.status_id) }}</p>

      <div class="line"></div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show.detOrd = false">Cerrar</el-button>
        <el-button
          v-if="ordSelected.status_id === enums.ORD_STATUS.EN_PROCESO.id"
          type="warning"
          @click="changeDeliveryStatusLocal(enums.ORD_STATUS.EN_CAMINO.id)"
        >
          En camino
        </el-button>
        <el-button
          v-if="ordSelected.status_id === enums.ORD_STATUS.EN_CAMINO.id"
          type="success"
          @click="changeDeliveryStatusLocal(enums.ORD_STATUS.COMPLETADO.id)"
        >
          Completar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "DetalleOrden",
  props: {
    show: {
      type: Object,
      default: () => ({ detOrd: false }),
    },
    ordSelected: {
      type: Object,
      required: true,
    },
  },
  emits: ["updateOrders"],
  data() {
    return {
      loadingDetalleOrd: false,
      productosInOrder: [],
    };
  },
  computed: {
    ...mapState("ordenes", [
      "dropDownMetodoPago",
      "dropDownTypeOfOrder",
      "tipoDistribucionArray",
      "dropdownStatus",
      "enums",
    ]),
  },
  watch: {
    ordSelected: {
      immediate: true,
      async handler(orden) {
        if (!orden) return;
        this.loadingDetalleOrd = true;
        this.productosInOrder = await this.GET_DETALLE_ORDEN({
          id_orden: this.ordSelected.id,
        });
        this.loadingDetalleOrd = false;
      },
    },
  },
  methods: {
    ...mapActions("ordenes", ["changeDeliveryStatus", "GET_DETALLE_ORDEN"]),
    formatDate(id) {
      const date = new Date(id);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString("en-US", {
        hour12: true,
      })}`;
    },
    async changeDeliveryStatusLocal(statusId) {
      await this.changeDeliveryStatus({
        id_orden: this.ordSelected.id,
        statusId,
      });
      this.$emit("updateOrders");
      // eslint-disable-next-line
      this.show.detOrd = false;
    },
    getMetPago(id) {
      const res = this.dropDownMetodoPago.find((item) => item.id === id);
      return res?.name;
    },
    getTipoOrd(id) {
      const res = this.dropDownTypeOfOrder.find((item) => item.id === id);
      return res?.name;
    },
    getDistributionType(id) {
      const res = this.tipoDistribucionArray.find((item) => item.id === id);
      return res?.name;
    },
    getStatus(id) {
      const status = this.dropdownStatus.find((item) => item.id === id);
      return status?.name;
    },
  },
};
</script>

<style scoped>
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
/* :deep(.el-dialog__body) {
  background-color: #e3e3e3;
} */
:deep(.bg-success) {
  background-image: radial-gradient(
    circle farthest-corner at 50.4% 50.5%,
    #0eae57 0%,
    rgb(0 123 57) 90%
  );
}
:deep(.modal-header) {
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
}
:deep(.modal-footer) {
  box-shadow: 0.125rem -0.8rem 20px 0px rgb(0 0 0 / 10%);
}
:deep(.modal-title) {
  padding-left: 2.5rem;
}
:deep(.bg-warning) {
  background-image: radial-gradient(
    circle farthest-corner at 50.4% 50.5%,
    #ff7600fd 0%,
    #c34600 90%
  );
}
:deep(.bg-danger) {
  background-image: radial-gradient(
    circle farthest-corner at 50.4% 50.5%,
    rgb(255 0 0) 0%,
    #870223 90%
  );
}
.roundedBorder {
  border-radius: calc(1rem - 1px) calc(1rem - 1px) 0 0;
}
/* fila con 2 columnas */
/* Create two equal columns that floats next to each other */
.column {
  float: left;
  width: 45%;
  margin-left: 1.5rem;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>
