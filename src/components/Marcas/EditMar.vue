<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="show.modalEditarMar"
    title="Editar Marca"
    width="90%"
  >
    <div class="card-body">
      <div class="form-group row">
        <label class="col-md-3 form-control-label">Nombre</label>
        <div class="col-md-9">
          <input
            v-if="marSelected.doc"
            v-model="marSelected.doc.nombreMarca"
            type="text"
            class="form-control"
          >
        </div>
      </div>
      <div class="line"></div>
      <div class="form-group row">
        <label class="col-md-3 form-control-label">Descripción</label>
        <div class="col-md-9">
          <textarea
            v-if="marSelected.doc"
            id="exampleFormControlTextarea1"
            v-model="marSelected.doc.descripMarca"
            class="form-control"
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="show.modalEditarMar = false"> Cancelar </el-button>
      <el-button type="primary" @click="edithRegistro();show.modalEditarMar = false;"> Guardar </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "EditMar",
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
    ...mapState("marcas", ["marSelected"]),
  },
  methods: {
    ...mapActions("marcas", ["edithRegistro"]),
  },
};
</script>