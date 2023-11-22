<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="mostrar.addToCartModal"
    title="Agregar al carrito"
    align-center
    width="90%"
    top="5vh"
  >
    <div class="text-center">
      <h4>{{ prodSelected.nombre_producto }}</h4>
    </div>
    <div class="text-center"><h4>Precio:</h4></div>
    <el-radio-group v-model="price">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-radio :label="prodSelected.precio_publico" size="small" border>
            ${{ prodSelected.precio_publico }}
          </el-radio>
        </el-col>
        <el-col :span="8">
          <el-radio :label="prodSelected.precio_mayoreo" size="small" border>
            ${{ prodSelected.precio_mayoreo }}
          </el-radio>
        </el-col>
        <el-col :span="8">
          <el-radio :label="prodSelected.precio_taller" size="small" border>
            ${{ prodSelected.precio_taller }}
          </el-radio>
        </el-col>
      </el-row>
      <el-radio :label="price" border>
        <el-input-number
          v-model="price"
          :precision="2"
          :min="0"
          size="small"
        />
      </el-radio>
    </el-radio-group>
    <div class="text-center"><h4>Cantidad:</h4></div>
    <div class="text-center">
      <el-input-number
        v-model="cantidad"
        :precision="0"
        :min="0"
        :max="stock"
      /><br />
      (STOCK: {{ stock }})
    </div>
    <div class="text-center pt-2"><h4>Sub-total:</h4></div>
    <div class="text-center">
      <h5>${{ subtotal }}</h5>
    </div>

    <template #footer>
      <span class="dialog-footer d-flex">
        <el-button @click="mostrar.addToCartModal = false">Cancelar</el-button>
        <el-button
          v-if="ordenDetalleProductos[prodSelected.id]?.cantidad > 0"
          type="danger"
          @click="
            mostrar.addToCartModal = false;
            REMOVE_FROM_CART(prodSelected.id);
          "
        >
          Quitar
        </el-button>
        <el-button
          :disabled="subtotal === 0"
          type="success"
          @click="addToCart()"
        >
          Confirmar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "AddToCartModal",
  components: {},
  props: {
    prodSelected: {
      type: Object,
      default: () => ({}),
    },
    mostrar: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      price: this.prodSelected?.precio_publico || 0,
      cantidad: 0,
      userOrganization: localStorage.getItem("locationSelected"),
    };
  },
  computed: {
    ...mapState("productos", ["ordenDetalleProductos"]),
    subtotal() {
      // Validate inputs
      if (
        typeof this.price !== "number" ||
        Number.isNaN(this.price) ||
        this.price <= 0
      ) {
        return 0.0;
      }

      if (
        typeof this.cantidad !== "number" ||
        Number.isNaN(this.cantidad) ||
        this.cantidad <= 0 ||
        !Number.isInteger(this.cantidad)
      ) {
        return 0.0;
      }
      return this.$twoDecimalsOnly(this.price * this.cantidad);
    },
    stock() {
      switch (this.userOrganization) {
        case "Santa Ana":
          return this.prodSelected.stock_prod_sta_ana;
        case "Metapan":
          return this.prodSelected.stock_prod_metapan;
        default:
          window.console.warn("No se encontró la división");
          return 0;
      }
    },
  },
  watch: {},
  mounted() {
    if (
      Object.hasOwnProperty.call(
        this.ordenDetalleProductos,
        this.prodSelected?.id,
      )
    ) {
      const prod = this.ordenDetalleProductos[this.prodSelected?.id];
      this.cantidad = prod.cantidad;
      this.price = prod.price;
    }
  },
  methods: {
    ...mapMutations("productos", ["SET_DETALLE_PRODUCTOS", "REMOVE_FROM_CART"]),
    addToCart() {
      const tmpProd = {
        id: this.prodSelected.id,
        subtotal: this.subtotal,
        cantidad: this.cantidad,
        price: this.price,
        name: this.prodSelected.nombre_producto,
        stock: this.stock,
      };
      this.SET_DETALLE_PRODUCTOS({ prod: tmpProd });
      // eslint-disable-next-line
      this.mostrar.addToCartModal = false;
    },
  },
};
</script>

<style scoped>
:deep(.el-radio-group),
.el-radio-group {
  justify-content: center;
}
.pt-2 {
  padding-top: 2rem !important;
}
.d-flex {
  display: flex;
  justify-content: end;
}
</style>
