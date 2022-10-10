<template>
  <div>
    <b-modal id="verifyModifications" centered title="Confirmar modificaciones">
      <div class="card-body">
        <!-- Div de nuevos productos -->
        <div v-if="filteredArrayNewProd.length > 0">
          <b-card no-body class="text-center">
            <div class="bg-success text-light roundedBorder">
              <h4>
                <b>Productos a agregar: ({{ filteredArrayNewProd.length }})</b>
              </h4>
            </div>
          </b-card>
          <!-- tabla Nuevos productos -->
          <b-table
            striped
            hover
            :items="filteredArrayNewProd"
            :fields="headerLabels"
          ></b-table>
        </div>
        <!-- Fin de Div de nuevos productos -->
        <!-- Div de productos modificados -->
        <div v-if="editTransaction.length > 0">
          <b-card no-body class="text-center">
            <div class="bg-warning text-light roundedBorder">
              <h4>
                <b>Productos a modificar: ({{ editTransaction.length }})</b>
              </h4>
            </div>
          </b-card>
          <!-- tabla productos editados -->
          <b-table
            striped
            hover
            :items="editTransaction"
            :fields="headerLabels"
          ></b-table>
        </div>
        <!-- Fin de Div de productos editados -->
        <!-- Div de productos eliminados -->
        <div v-if="deleteTransaction.length > 0">
          <b-card no-body class="text-center">
            <div class="bg-danger text-light roundedBorder">
              <h4>
                <b>Productos a eliminar: ({{ deleteTransaction.length }})</b>
              </h4>
            </div>
          </b-card>
          <!-- tabla productos eliminados -->
          <b-table
            striped
            hover
            :items="deleteTransaction"
            :fields="headerLabels"
          ></b-table>
        </div>
        <!-- Fin de Div de productos eliminados -->
      </div>

      <template #modal-footer="{ cancel, ok }">
        <b-button size="m" variant="secondary" @click="cancel()">
          Cancelar
        </b-button>
        <b-button
          size="m"
          variant="primary"
          @click="
            ok();
            applyAllChanges();
          "
        >
          Efectuar Cambios
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ConfirmarTransacciones',
  data() {
    return {
      headerLabels: [
        { key: 'upc', label: 'UPC' },
        { key: 'nombreProd', label: 'Nombre' },
        { key: 'nombreMarca', label: 'Marca' },
        { key: 'nombreCategoria', label: 'Categoria' },
        { key: 'precioUnit', label: 'Precio unitario' },
        { key: 'descripcion', label: 'Descripcion' },
        { key: 'stockProd', label: 'Stock' },
      ],
    };
  },
  computed: {
    ...mapState('productos', [
      'newProd',
      'deleteTransaction',
      'editTransaction',
    ]),
    filteredArrayNewProd() {
      const cachedProd = JSON.parse(JSON.stringify(this.newProd));
      return cachedProd.filter((prod) => {
        const {state} = prod;
        // delete prod.format;
        // delete prod.activoProd;
        // delete prod.state;
        return state === 1;
      });
    },
  },
  methods: {
    ...mapMutations('productos', ['applyAllChanges']),
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
</style>