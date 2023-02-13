<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="show.modalEliminarMar"
    title="Eliminar Marca"
    width="90%"
  >
    <div class="card-body">
      <h6 v-if="marca.doc" style="font-weight: 400; text-align: center">
        ¿Está seguro que quiere eliminar la marca "{{ marca.doc.nombreMarca }}"?
      </h6>
    </div>
    <template #footer>
      <el-button @click="show.modalEliminarMar = false"> Cancelar </el-button>
      <el-button type="danger" @click="removeRegistro();show.modalEliminarMar = false;"> Eliminar </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "DeleteMar",
  props: {
    show: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("marcas", ["marca"]),
  },
  methods: {
    ...mapActions("marcas", ["removeRegistro"]),
  },
};
</script>