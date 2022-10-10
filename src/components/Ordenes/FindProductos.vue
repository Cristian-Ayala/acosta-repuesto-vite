<template>
  <tr class="d-flex w-100 justify-content-between">
    <td class="imgCenter">
      <img :src="prod.doc.foto" height="50px" width="50px" >
    </td>
    <td>
      <div class="h-100">
        <!-- eslint-disable-next-line -->
        <p v-if="prod.highlighting.nombreProd" class="align-self-center" v-html="prod.highlighting.nombreProd"></p>
        <p v-else class="align-self-center">{{ prod.doc.nombreProd }}</p>
        <h6 style="color: #009722">${{ prod.doc.precioPublico }}</h6>
        Stock: {{ prod.doc.stockProd }}
        <div v-if="showQuantity">
          <p>Cantidad: {{ ordenDetalleProductos[prod.doc.upc].cantidad }}</p>
          <p>Subtotal: ${{ ordenDetalleProductos[prod.doc.upc].subtotal }}</p>
        </div>
      </div>
    </td>
    <td class="tdVerdeClick">
      <div
        v-if="!showQuantity"
        class="add"
        @click="$emit('addTmpProducts', prod.doc, true, index)"
      >
        <i class="fas fa-plus"></i>
      </div>
      <div v-else class="h-100">
        <div
          class="plus_minus"
          @click="$emit('addTmpProducts', prod.doc, true, index)"
        >
          <i class="fas fa-plus"></i>
        </div>
        <div
          class="plus_minus"
          @click="$emit('addTmpProducts', prod.doc, false, index)"
        >
          <i class="fas fa-minus"></i>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
// import { mapState, mapMutations } from "vuex";

export default {
  name: 'FindProductos',
  props: {
    prod: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    ordenDetalleProductos: {
      type: Object,
      required: true,
    },
  },
  emits: ['addTmpProducts'],
  data() {
    return {};
  },
  //   methods: {
  //     ...mapMutations("ordenes", [
  //       "change",
  //       "decProducto",
  //       "incProducto",
  //       "filtroProd",
  //       "dosDecimalesProd",
  //     ]),
  //   },
  computed: {
    showQuantity () {
      return (
        typeof this.ordenDetalleProductos !== 'undefined' &&
        Object.hasOwnProperty.call(
          this.ordenDetalleProductos,
          this.prod.doc.upc
        ) &&
        Object.hasOwnProperty.call(
          this.ordenDetalleProductos[this.prod.doc.upc],
          'cantidad'
        ) &&
        this.ordenDetalleProductos[this.prod.doc.upc].cantidad >= 1
      );
    },
  },
};
</script>

<style scoped>
.imgCenter {
  align-self: center;
  border: none;
}
.tdVerdeClick {
  background-color: #28a745;
  border-radius: 0 1rem 1rem 0;
  color: #fff;
}
.add {
  height: 100%;
  display: flex;
  align-items: center;
}
.plus_minus {
  height: 50%;
  display: flex;
  align-items: center;
}
</style>