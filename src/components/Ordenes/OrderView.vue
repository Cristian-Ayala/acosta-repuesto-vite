<template>
  <div class="order">
    <div id="leftSide" :style="`background-color: var(--el-color-${statusColor});`">
      <el-button :type="statusColor" circle>
        <i v-if="orden.tipoOrden === 'Local'" class="fas fa-store"></i>
        <i v-else class="fas fa-motorcycle"></i>
      </el-button>
    </div>
    <div id="rigthSide">
      <div v-if="orden && orden.nombreCliente" class="orderName">
        {{ orden.nombreCliente }}
      </div>
      <div v-if="orden && orden._id">
        {{ formatDate(orden._id) }}
      </div>
      <div v-if="orden && orden.telefono">
        {{ orden.telefono }}
      </div>
      <div v-if="orden && typeof orden.totalOrden === 'number'">
        $ {{ orden.totalOrden }}
      </div>
      <a href="#" @click="show.detOrd = true"> Ver detalles </a>
    </div>
    <detalle-orden :ord-selected="orden" :show="show" @update-orders="updateOrders()"></detalle-orden>
  </div>
</template>

<script>
import DetalleOrden from '@/components/Ordenes/DetalleOrden.vue';

export default {
  name: 'OrderView',
  components: {
    DetalleOrden,
  },
  props: {
    orden: {
      type: Object,
      required: true,
    },
  },
  emits: ['updateOrders'],
  data() {
    return {
      show: {
        detOrd: false,
      },
    };
  },
  computed: {
    statusColor () {
        if (!this.orden) return 'danger';
        switch (this.orden.status) {
            case 'Completado':
                return 'success';
            case 'En proceso':
                return 'warning';
            case 'En camino':
                return 'primary';
            default:
                // In case of cancelado
                return 'danger';
        }
    },
  },
  mounted() {
    // console.log({ ...this.orden });
  },
  methods: {
    formatDate(id) {
        const date = new Date(id);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-US', { hour12: true })}`;
    },
    updateOrders() {
      this.$emit('updateOrders');
    },
  },
};
</script>

<style scoped>
.order {
  padding: 0.5rem;
  display: flex;
  align-items: center;
  margin: 0.5rem .5rem;
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
