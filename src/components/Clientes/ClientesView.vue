<template>
  <div class="clientes">
    <div class="containerCliente">
      <div
        id="leftSide"
        @click="showActions()"
      >
        <el-button color="#143642" circle>
          <i class="fas fa-user-alt"></i>
        </el-button>
      </div>
      <div id="rigthSide">
        <div v-if="client.name || client.last_name" class="clienteName">
          {{ `${client.name} ${client.last_name}` }}
        </div>
        <div v-if="client.email">
          {{ client.email }}
        </div>
        <div v-if="client.telefono">
          {{ client.telefono }}
        </div>
        <div v-if="client.direccion">
          {{ client.direccion }}
        </div>
        <div v-if="client.empresa">
          {{ client.empresa }}
        </div>
      </div>
    </div>
    <Transition name="scaleCenter">
      <div
        v-if="show.actions"
        class="wrapperActions"
        @click="show.actions = false"
      >
        <el-button
          type="danger"
          circle
          @click="
            setClienteSelected();
            show.modalEliminarMar = true;
          "
        >
          <i class="fas fa-times" aria-hidden="true"></i>
        </el-button>
        <el-button
          type="warning"
          circle
          @click="
            setClienteSelected();
            show.modalAgregarMar = true;
          "
        >
          <i class="fas fa-pencil-alt" aria-hidden="true"></i>
        </el-button>
      </div>
    </Transition>
  </div>
</template>

<script>
import "animate.css";

export default {
  name: "ClientesView",
  components: {},
  props: {
    client: {
      type: Object,
      required: true,
    },
  },
  emits: ["updateOrders"],
  data() {
    return {
      show: {
        actions: false,
      },
    };
  },
  computed: {},
  mounted() {},
  methods: {
    showActions() {
      window.console.log("flag actions");
      this.show.actions = true;
    },
    formatDate(id) {
      const date = new Date(id);
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
.clientes {
  padding: 0.5rem;
  display: grid;
  align-items: center;
  margin: 0.5rem 0.5rem;
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
  background-color: #fff;
  border-radius: 1rem;
}
.clienteName {
  font-size: 1rem;
  font-weight: bold;
}
.containerCliente {
  display: flex;
  align-items: stretch;
  grid-column: 1;
  grid-row: 1;
}
#leftSide {
  padding: 1rem;
  align-self: center;
}
.wrapperActions {
  grid-column: 1;
  grid-row: 1;
  background: #ffffffb2;
  text-align: center;
  border-radius: 1rem;
}
.scaleCenter-enter-active {
  animation: zoomIn;
  animation-duration: 0.5s;
}

.scaleCenter-leave-active {
  animation: zoomOut;
  animation-duration: 0.5s;
}
.el-button.is-circle {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
}
</style>
