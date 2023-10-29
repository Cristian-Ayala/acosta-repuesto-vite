<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="mostrar.deleteProduc"
    title="Eliminar Producto"
    width="90%"
    top="5vh"
    align-center
  >
    <p class="my-4" style="word-break: break-word">
      ¿Seguro quiere eliminar el producto:
      {{ newProductMobile.nombre_producto }}?
    </p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="mostrar.deleteProduc = false">Cancelar</el-button>
        <el-button
          type="danger"
          @click="
            deleteProducto({ id: newProductMobile.id });
            mostrar.deleteProduc = false;
          "
        >
          Confirmar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "EliminarProdMovil",
  props: {
    mostrar: {
      type: Object,
      default: () => ({}),
    },
    newProductMobile: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    ...mapActions("productos", ["deleteProducto"]),
  },
};
</script>
