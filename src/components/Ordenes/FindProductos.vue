<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <tr class="d-flex w-100 justify-content-between">
    <td class="imgCenter">
      <img :src="prod.foto" class="image">
      <div class="carousel-inner">
        <el-button plain class="plus-btn" size="small" @click="changeQuantity(false)">
          <i class="fas fa-minus"></i>
        </el-button>
        <input v-model.number="prod.cantidad" class="no-border">
        <!-- <p>Cantidad: {{ ordenDetalleProductos[prod.upc].cantidad }}</p> -->
        <el-button plain class="plus-btn" size="small" @click="changeQuantity(true)">
          <i class="fas fa-plus"></i>
        </el-button>
      </div>
    </td>
    <td>
      <div class="h-100">
        <p class="align-self-center">{{ prod.nombreProd }}</p>
        <div>
          <el-radio-group v-model="prod.price">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-radio :label="prod.precioPublico" size="small" border>${{prod.precioPublico}}</el-radio>
              </el-col>
              <el-col :span="8">
                <el-radio :label="prod.precioMayoreo" size="small" border>${{prod.precioMayoreo}}</el-radio>
              </el-col>
              <el-col :span="8">
                <el-radio :label="prod.precioTaller" size="small" border>${{prod.precioTaller}}</el-radio>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-radio :label="prod.price" size="small" border>
                  <input v-model.number="prod.price" class="no-border">
                </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </div>
        Stock: {{ prod.stockProd }}
        <div v-if="showQuantity">
          <p>Subtotal: ${{ ordenDetalleProductos[prod.upc].subtotal }}</p>
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
    ordenDetalleProductos: {
      type: Object,
      required: true,
    },
    tipoDist: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ['addTmpProducts', 'reCalculateSubTotal'],
  data() {
    return {};
  },
  computed: {
    showQuantity () {
      return (
        typeof this.ordenDetalleProductos !== 'undefined' &&
        Object.hasOwnProperty.call(
          this.ordenDetalleProductos,
          this.prod.upc
        ) &&
        Object.hasOwnProperty.call(
          this.ordenDetalleProductos[this.prod.upc],
          'cantidad'
        ) &&
        this.ordenDetalleProductos[this.prod.upc].cantidad >= 1
      );
    },
  },
  watch: {
    'prod.price': {
      handler () {
        this.$emit('reCalculateSubTotal', this.index, this.prod);
      },
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.prod.cantidad = this.ordenDetalleProductos[this.prod?.upc]?.cantidad || 0;
    this.showPrice(this.prod);
  },
  methods: {
    // ...mapMutations("ordenes", [
    //   "change",
    //   "decProducto",
    //   "incProducto",
    //   "filtroProd",
    //   "dosDecimalesProd",
    // ]),
    showPrice(prod) {
      if (this.ordenDetalleProductos[this.prod?.upc]) {
        // eslint-disable-next-line
        this.prod.price = this.ordenDetalleProductos[this.prod?.upc]?.price;
        return;
      }
      switch (this.tipoDist) {
      case 'Público':
        // eslint-disable-next-line
        this.prod.price = prod.precioPublico;
        break;
      case 'Mayoreo':
        // eslint-disable-next-line
        this.prod.price = prod.precioMayoreo;
        break;
      case 'Taller':
        // eslint-disable-next-line
        this.prod.price = prod.precioTaller;
        break;
      default:
        // eslint-disable-next-line
        this.prod.price = 0.0;
        break;
      }
    },
    changeQuantity(addOrSubstract = false) {
      this.$emit('addTmpProducts', this.prod, this.index, addOrSubstract);
    }
  },
};
</script>

<style scoped>
.imgCenter {
  border: none;
  padding: 0;
}
.image {
  width: 100%;
  border-radius: 1rem 0 0 0;
  max-height: 4rem;
  object-fit: cover;
}
input.no-border {
  border-style: none;
  width: 3rem;
  outline: none;
  text-align: center;
}
div.carousel-inner input.no-border {
  background-color: transparent;
  color: white;
}
:deep(.el-radio-group){
  place-content: center;
}
.plus_minus {
  background-color: #d3d3d3;
  color: #000;
}
.carousel-inner {
  display: flex;
  background-color: #3e3e3e;
  padding: 0.3rem;
  border-radius: 0.4rem;
  margin-top: 1rem;
}
.minus-btn {
  float: left;
  margin: 0 0 0 1rem;
  text-decoration: none;
}
.plus-btn {
  text-decoration: none;
  height: 1.5rem;
  width: 1.5rem;
}
</style>