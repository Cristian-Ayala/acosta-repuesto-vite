<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="show.modalAgregarMar"
    title="Agregar marca"
    width="90%"
  >
    <div class="card-body">
      <div class="form-group row">
        <label class="col-md-3 form-control-label">Nombre</label>
        <div class="col-md-9">
          <input
            v-model="marca.nombreMarca"
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
            v-model="marca.descripMarca"
            class="form-control"
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show.modalAgregarMar = false"> Cancelar </el-button>
        <el-button type="primary" @click="createRegistro();show.modalAgregarMar = false;"> Guardar </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "AgregarMar",
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
    ...mapActions("marcas", ["createRegistro"]),
  },
};
</script>
