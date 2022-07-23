<template>
  <div>
    <b-modal
      id="detalleOrden"
      centered
      title="Detalle Orden"
      v-model="alwaysTrue"
      v-if="showDetOrd"
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
          <b-card no-body class="text-center">
            <div class="bg-success text-light roundedBorder">
              <h4>
                <b>Productos:</b>
              </h4>
            </div>
          </b-card>
          <!-- tabla de productos -->
          <b-table
            striped
            hover
            :items="ordSelected.productos"
            :fields="headerLabels"
          ></b-table>
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
        
        <div class="line"></div>
      </div>

      <template #modal-footer="{ cancel, ok }">
        <b-button size="m" variant="secondary" @click="cancel()">
          Cancelar
        </b-button>
        <b-button size="m" variant="primary" @click="ok()">
          Efectuar Cambios
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "DetalleOrden",
  props: ["ordSelected", "showDetOrd"],
  data() {
    return {
      headerLabels: [
        { key: "upc", label: "UPC" },
        { key: "nombreProd", label: "Nombre" },
        { key: "nombreMarca", label: "Marca" },
        { key: "nombreCategoria", label: "Categoria" },
        { key: "precioUnit", label: "Precio unitario" },
        "cantidad",
        "descuento",
        { key: "subtotal", label: "Sub-Total" },
      ],
      alwaysTrue: true,
    };
  },
  methods: {
    formatDate(id) {
        let date = new Date(id);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-US', { hour12: true })}`;
    },
  },
  watch: {
    alwaysTrue: {
      handler(newValue) {
        if (!newValue) this.alwaysTrue = true;
      }
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