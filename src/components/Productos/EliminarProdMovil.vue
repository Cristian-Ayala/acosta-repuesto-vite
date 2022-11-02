<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="mostrar.deleteProduc"
    title="Eliminar Producto"
    width="90%"
    top="5vh"
  >
    <p v-if="newProductMobile.doc" class="my-4" style="word-break: break-word;">
      ¿Seguro quiere eliminar el producto:
      {{ newProductMobile.doc.nombreProd }}?
    </p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="mostrar.deleteProduc = false">Cancelar</el-button>
        <el-button
          type="danger"
          @click="deleteProducto(newProductMobile);mostrar.deleteProduc = false;"
        >
          Confirmar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'EliminarProdMovil',
  props: {
    mostrar: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('productos', [
      'newProductMobile',
    ]),
  },
  methods: {
    ...mapActions('productos', [
      'deleteProducto',
    ]),
  },
};
</script>
