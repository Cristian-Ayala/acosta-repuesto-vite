<template>
  <el-dialog
  v-model="show.modalEliminarMar"
  title="Eliminar Marca"
  width="90%"
  >
    <div class="card-body">
      <h6 style="font-weight: 400; text-align: center" v-if="marca.doc">
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
  props: ['show'],
  data() {
    return {};
  },
  methods: {
    ...mapActions("marcas", ["removeRegistro"]),
  },
  computed: {
    ...mapState("marcas", ["marca"]),
  },
};
</script>