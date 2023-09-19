<template>
  <!-- eslint-disable vue/no-mutating-props -->
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
            v-model.trim="categoria.nombre_categoria"
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
            id="exampleFormControlTextarea1"
            v-model.trim="categoria.descripcion_categoria"
            class="form-control"
            rows="3"
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
import { mapActions } from "vuex";

export default {
  name: "AgregarCat",
  props: {
    show: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      categoria: {
        nombre_categoria: "",
        descripcion_categoria: "",
      },
    };
  },
  computed: {
  },
  methods: {
    ...mapActions("categorias",["createRegistro"]),
    createRegistro() {
      // commit("errorNotification", "Por favor, introduce un nombre para la categoria.");
      // "Por favor, introduce un nombre para la marca. (DO NOT REPORT THIS ERROR)",
      this.createRegistro(this.categoria);
    }
  },
};
</script>
