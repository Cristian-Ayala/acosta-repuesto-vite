<template>
  <el-dialog
      v-model="show.modalEditCat"
      title="Editar categoria"
      width="90%"
  >
    <div class="card-body">
      <div class="form-group row">
        <label class="col-md-3 form-control-label">Nombre</label>
        <div class="col-md-9">
          <input
          v-if="catSelected.doc"
            type="text"
            class="form-control"
            v-model="catSelected.doc.nombreCategoria"
          />
        </div>
      </div>
      <div class="line"></div>
      <div class="form-group row">
        <label class="col-md-3 form-control-label">Descripción</label>
        <div class="col-md-9">
          <textarea
          v-if="catSelected.doc"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            v-model="catSelected.doc.descripcion"
          ></textarea>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="show.modalEditCat = false"> Cancelar </el-button>
      <el-button type="primary" @click="edithRegistro();show.modalEditCat = false;"> Guardar </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "EditCat",
  props: ['show'],
  data() {
    return {
    };
  },
  methods: {
    ...mapActions("categorias",["edithRegistro"]),
  },
  computed: {
    ...mapState("categorias",["catSelected"]),
  },
  mounted() {
  },
};
</script>