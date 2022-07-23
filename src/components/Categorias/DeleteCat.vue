<template>
  <el-dialog
    v-model="show.modalEliminarCat"
    title="Eliminar categoria"
    width="90%"
  >
    <div class="card-body">
      <h6 style="font-weight: 400; text-align: center" v-if="categoria.doc">
        ¿Está seguro que quiere eliminar la categoria "{{
          categoria.doc.nombreCategoria
        }}"?
      </h6>
    </div>
    <template #footer>
      <el-button @click="show.modalEliminarCat = false"> Cancelar </el-button>
      <el-button type="danger" @click="removeRegistro();show.modalEliminarCat = false;"> Eliminar </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "AgregarCat",
  props: ['show'],
  data() {
    return {};
  },
  methods: {
    ...mapActions("categorias", ["removeRegistro"]),
  },
  computed: {
    ...mapState("categorias", ["categoria"]),
  },
};
</script>