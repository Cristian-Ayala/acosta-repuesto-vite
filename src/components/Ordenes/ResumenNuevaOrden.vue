<template>
  <tr v-if="prod.cantidad > 0" class="w-100">
    <td>
      <div class="h-100">
        <p class="align-self-center">{{ prod.name }}</p>
        <div>
          <p style="font-size: 0.6rem">
            <span> <b>Precio:</b> ${{ prod.price }} </span>
            <span> <b>Cantidad:</b> {{ prod.cantidad }} </span>
            <span> <b>Subtotal:</b> ${{ prod.subtotal }} </span>
          </p>
        </div>
      </div>
    </td>
    <td class="tdVerdeClick">
      <div class="h-100">
        <div class="plus_minus" @click="addProdQuantity(true)">
          <i class="fas fa-plus"></i>
        </div>
        <div class="plus_minus" @click="addProdQuantity(false)">
          <i class="fas fa-minus"></i>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "ResumenNuevaOrden",
  props: {
    prod: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations("productos", ["SET_DETALLE_PRODUCTOS"]),
    addProdQuantity(add) {
      const action = {};
      if (add) action.addOne = true;
      else action.removeOne = true;
      this.SET_DETALLE_PRODUCTOS({ prod: this.prod, ...action });
    },
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
p > span {
  padding-right: 0.3rem;
}
</style>
