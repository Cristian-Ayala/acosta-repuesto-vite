<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="show.detOrd"
    title="Detalle Orden"
    width="90%"
    top="5vh"
  >
    <div class="card-body">
      <h5>Fecha:</h5>
      <p>{{ formatDate(ordSelected._id) }}</p>

      <h5 v-if="ordSelected.nombreCliente">Nombre del cliente:</h5>
      <p>{{ ordSelected.nombreCliente }}</p>

      <h5>Método de pago:</h5>
      <p>{{ ordSelected.metodoPago }}</p>

      <div class="line"></div>
      <div>
        <h5>Productos:</h5>
        <!-- tabla de productos -->
        <el-table :data="ordSelected.productos" style="width: 100%" stripe>
          <!-- <el-table-column prop="upc" label="UPC" /> -->
          <el-table-column prop="nombreProd" label="Nombre" width="300"/>
          <el-table-column prop="precioPublico" label="Precio unitario" />
          <el-table-column prop="cantidad" label="Cantidad" />
          <!-- <el-table-column prop="descuento" label="Descuento" /> -->
          <el-table-column prop="subtotal" label="Sub-Total" />
        </el-table>
      </div>
      <h6 style="margin-top: 1rem; font-weight: 900; text-align: center">
        Total: {{ ordSelected.totalOrden }}
      </h6>
      <div class="line"></div>
      <h5 v-if="ordSelected.observacionesOrden">Descripción:</h5>
      <p>{{ ordSelected.observacionesOrden }}</p>

      <h5>Tipo de orden:</h5>
      <p>{{ ordSelected.tipoOrden }}</p>

      <h5>Tipo de distribución:</h5>
      <p>{{ ordSelected.tipoDistribucion }}</p>

      <h5>Estado:</h5>
      <p>{{ ordSelected.status }}</p>

      <div class="line"></div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show.detOrd = false">Cerrar</el-button>
        <el-button
          v-if="ordSelected.status === 'En proceso'"
          type="warning"
          @click="changeDeliveryStatusLocal('En camino')"
        >
          En camino
        </el-button>
        <el-button
          v-if="ordSelected.status === 'En camino'"
          type="success"
          @click="changeDeliveryStatusLocal('Completado')"
        >
          Completar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'DetalleOrden',
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
  emits: ['updateOrders'],
  data() {
    return {
    };
  },
  watch: {
  },
  methods: {
    ...mapActions('ordenes', ['changeDeliveryStatus']),
    formatDate(id) {
        const date = new Date(id);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-US', { hour12: true })}`;
    },
    async changeDeliveryStatusLocal (status){
      await this.changeDeliveryStatus({ id: this.ordSelected._id, status });
      this.$emit('updateOrders');
      // eslint-disable-next-line
      this.show.detOrd = false;
    }
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