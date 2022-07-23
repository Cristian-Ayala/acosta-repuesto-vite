<template>
  <el-dialog
    v-model="show.modalAgregarCat"
    title="Agregar categoria"
    width="90%"
  >
    <div class="card-body">
      <div class="form-group row">
        <label class="col-md-3 form-control-label">Nombre</label>
        <div class="col-md-9">
          <input
            type="text"
            class="form-control"
            v-model="categoria.nombreCategoria"
          />
        </div>
      </div>
      <div class="line"></div>
      <div class="form-group row">
        <label class="col-md-3 form-control-label">Descripción</label>
        <div class="col-md-9">
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            v-model="categoria.descripcion"
          ></textarea>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="show.modalAgregarCat = false"> Cancelar </el-button>
      <el-button type="primary" @click="createRegistro();show.modalAgregarCat = false;"> Guardar </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "AgregarCat",
  props: ['show'],
  data() {
    return {
    };
  },
  methods: {
    ...mapActions("categorias",["createRegistro"]),
  },
  computed: {
    ...mapState("categorias",["categoria"]),
  },
};
</script>
