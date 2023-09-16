<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog v-model="show.modalEliminarMar" title="Eliminar Marca" width="90%">
    <div class="card-body">
      <h6 v-if="marca" style="font-weight: 400; text-align: center">
        ¿Está seguro que quiere eliminar la marca "{{ marca.nombre_marca }}"?
      </h6>
    </div>
    <template #footer>
      <el-button @click="show.modalEliminarMar = false"> Cancelar </el-button>
      <el-button type="danger" @click="removeMarca()"> Eliminar </el-button>
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
    marcaProp: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["clearMarcaSelected"],
  data() {
    return {};
  },
  watch: {
    marcaProp: {
      deep: true,
      handler(newValue) {
        if (Object.keys(newValue).length === 0) return;
        this.marca = newValue;
      },
    },
  },
  beforeUnmount() {
    this.$emit("clearMarcaSelected");
  },
  methods: {
    ...mapActions("marcas", ["removeRegistro"]),
    removeMarca() {
      const marcaID = this.marcaProp.id;
      this.removeRegistro({ id: marcaID });
      /* eslint-disable vue/no-mutating-props */
      this.show.modalEliminarMar = false;
    },
  },
};
</script>
