<template>
  <tr class="w-100">
    <td>
      <div class="h-100">
        <!-- eslint-disable-next-line -->
        <p class="align-self-center" v-html="prod.nombreProd"></p>
        <div v-if="showQuantity">
          <p style="font-size: 0.6rem">
            <b>Precio:</b> ${{ prod.precioPublico }} <b>Cantidad:</b>
            {{ ordenDetalleProductos[prod.upc].cantidad }} <b>Subtotal:</b> ${{
              ordenDetalleProductos[prod.upc].subtotal
            }}
          </p>
        </div>
      </div>
    </td>
    <td class="tdVerdeClick">
      <div
        v-if="!showQuantity"
        class="add"
        @click="$emit('addTmpProducts', prod, true, indexForComponent, true)"
      >
        <i class="fas fa-plus"></i>
      </div>
      <div v-else class="h-100">
        <div
          class="plus_minus"
          @click="$emit('addTmpProducts', prod, true, indexForComponent, true)"
        >
          <i class="fas fa-plus"></i>
        </div>
        <div
          class="plus_minus"
          @click="$emit('addTmpProducts', prod, false, indexForComponent, true)"
        >
          <i class="fas fa-minus"></i>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'ResumenNuevaOrden',
  props: {
    prod: {
      type: Object,
      required: true,
    },
    indexForComponent: {
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
    return {
      showQuantity: false,
    };
  },
  created() {
    this.showQuantity =
      this.ordenDetalleProductos[this.prod.upc] !== undefined &&
      this.ordenDetalleProductos[this.prod.upc].cantidad >= 1;
  },
};
</script>

<style scoped>
.tdVerdeClick {
  background-color: #28a745;
  color: #fff;
}
.add {
  height: 100%;
  display: flex;
  align-items: center;
}
.plus_minus {
  padding: 1rem;
  justify-content: center;
  height: 50%;
  display: flex;
  align-items: center;
}
:deep(td) {
  padding: 0;
  border-top: none !important;
}
:deep(tr) {
  background-color: #fff;
  margin: 0 !important;
  border-radius: 0;
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
  border: 1px solid black;
}
</style>