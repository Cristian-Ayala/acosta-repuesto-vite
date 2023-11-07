<template>
  <div class="order">
    <div
      id="leftSide"
      :style="`background-color: var(--el-color-${statusColor});`"
    >
      <el-button :type="statusColor" circle>
        <i v-if="orden.tipo_orden_id === 23" class="fas fa-store"></i>
        <i v-else class="fas fa-motorcycle"></i>
      </el-button>
    </div>
    <div id="rigthSide">
      <div v-if="orden.cliente" class="orderName">
        {{ `${orden.cliente.name} ${orden.cliente.last_name}` }}
      </div>
      <div>
        {{ formatDate(orden.created_at) }}
      </div>
      <div>$ {{ orden.total_orden }}</div>
      <a href="#" @click="show.detOrd = true"> Ver detalles </a>
    </div>
    <detalle-orden
      v-if="show.detOrd"
      :ord-selected="orden"
      :show="show"
      @update-orders="updateOrders()"
    ></detalle-orden>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapState } from "vuex";

export default {
  name: "OrderView",
  components: {
    DetalleOrden: defineAsyncComponent(() =>
      import("@/components/Ordenes/DetalleOrden.vue"),
    ),
  },
  props: {
    orden: {
      type: Object,
      required: true,
    },
  },
  emits: ["updateOrders"],
  data() {
    return {
      show: {
        detOrd: false,
      },
    };
  },
  computed: {
    ...mapState("ordenes", ["enums"]),
    statusColor() {
      switch (this.orden.status_id) {
        case this.enums.ORD_STATUS.COMPLETADO.id:
          return "success";
        case this.enums.ORD_STATUS.EN_PROCESO.id:
          return "warning";
        case this.enums.ORD_STATUS.EN_CAMINO.id:
          return "primary";
        default:
          // In case of cancelado
          return "danger";
      }
    },
  },
  methods: {
    formatDate(orderDate) {
      const date = new Date(orderDate);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString("en-US", {
        hour12: true,
      })}`;
    },
    updateOrders() {
      this.$emit("updateOrders");
    },
  },
};
</script>

<style scoped>
.order {
  padding: 0.5rem;
  display: flex;
  align-items: center;
  margin: 0.5rem 0.5rem;
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
  background-color: #fff;
  border-radius: 1rem;
}
.orderName {
  font-size: 1rem;
  font-weight: bold;
}
#leftSide {
  width: 4rem;
  border-radius: 1rem 0 0 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}
</style>
