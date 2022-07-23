<template>
  <div class="order">
    <div id="leftSide">
      <b-avatar :variant="statusColor">
          <i class="fas fa-store" v-if="orden.tipoOrden === 'Local'"></i>
          <i class="fas fa-motorcycle" v-else></i>
      </b-avatar>
    </div>
    <div id="rigthSide">
      <div class="orderName" v-if="orden && orden.nombreCliente">
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
    <DetalleOrden :ordSelected="orden" :showDetOrd="showModalViewDetails"></DetalleOrden>
  </div>
</template>
<script>
import DetalleOrden from "@/components/Ordenes/DetalleOrden.vue";

export default {
  props: ["orden"],
  components: {
    DetalleOrden,
  },
  data() {
    return {
      showModalViewDetails: false,
    };
  },
  methods: {
    formatDate(id) {
        let date = new Date(id);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString('en-US', { hour12: true })}`;
    },
  },
  computed: {
    statusColor: function () {
        if (!this.orden) return "danger";
        
        switch (this.orden.status) {
            case "Completado":
                return "success";
            case "En proceso":
                return "warning";
            case "En camino":
                return "primary";
            default:
                // In case of cancelado
                return "danger";
        }
    },
  },
  mounted() {
    // console.log({ ...this.orden });
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
