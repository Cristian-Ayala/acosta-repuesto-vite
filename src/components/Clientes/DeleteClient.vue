<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="show.modalDeleteClient"
    title="Eliminar Cliente"
    width="90%"
  >
    <div class="card-body">
      <h6 v-if="client" style="font-weight: 400; text-align: center">
        ¿Está seguro que quiere eliminar al cliente
        "{{ `${client.name} ${client.last_name}` }}"?
      </h6>
    </div>
    <template #footer>
      <el-button @click="show.modalDeleteClient = false"> Cancelar </el-button>
      <el-button type="danger" @click="removeClienteLocal()"> Eliminar </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "DeleteMar",
  props: {
    show: {
      type: Object,
      required: true,
    },
    clientProp: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["clienteDeleted"],
  data() {
    return {
      client: {},
    };
  },
  watch: {
    clientProp: {
      deep: true,
      handler(newValue) {
        if (Object.keys(newValue).length === 0) return;
        this.client = newValue;
      },
    },
  },
  methods: {
    ...mapActions("clientes", ["removeCliente"]),
    async removeClienteLocal() {
      const clienteID = this.clientProp.id;
      await this.removeCliente({ id: clienteID });
      this.$emit("clienteDeleted");
    },
  },
};
</script>
