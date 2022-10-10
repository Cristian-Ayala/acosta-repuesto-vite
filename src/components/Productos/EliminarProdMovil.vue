<template>
  <div>
    <!-- inicio del modal para eliminar (mobile) -->
    <b-modal id="deleteProduc" title="Eliminar Producto" centered>
      <p v-if="newProductMobile.doc" class="my-4">
        ¿Seguro quiere eliminar el producto:
        {{ newProductMobile.doc.nombreProd }}?
      </p>
      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="danger" @click="cancel()">
          Cancelar
        </b-button>
        <b-button
          size="sm"
          variant="success"
          @click="
            ok();
            deleteProducto(newProductMobile);
          "
        >
          Si
        </b-button>
      </template>
    </b-modal>
    <!-- Fin del modal para eliminar (mobile) -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'EliminarProdMovil',
  computed: {
    ...mapState('productos', [
      'newProductMobile',
    ]),
  },
  methods: {
    ...mapActions('productos', [
      'deleteProducto',
      // "applyAllChanges"
    ]),
  },
};
</script>
