<template>
  <div class="order">
    <div id="leftSide">
      <b-avatar :variant="statusColor">
        <i v-if="orden.tipoOrden === 'Local'" class="fas fa-store"></i>
        <i v-else class="fas fa-motorcycle"></i>
      </b-avatar>
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
      <a href="#" @click="showModalViewDetails = !showModalViewDetails"> Ver detalles </a>
    </div>
    <detalle-orden :ord-selected="orden" :show-det-ord="showModalViewDetails"></detalle-orden>
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
  data() {
    return {
      showModalViewDetails: false,
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
  },
};
</script>

<style scoped>
.order {
  padding: 1rem;
  display: flex;
  align-items: center;
  margin: 1rem 0;
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
  text-align: center;
}
</style>
