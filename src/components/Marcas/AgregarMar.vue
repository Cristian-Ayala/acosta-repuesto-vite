<template>
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
            type="text"
            class="form-control"
            v-model="marca.nombreMarca"
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
            v-model="marca.descripMarca"
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
  props: ['show'],
  data() {
    return {};
  },
  methods: {
    ...mapActions("marcas", ["createRegistro"]),
  },
  computed: {
    ...mapState("marcas", ["marca"]),
  },
};
</script>
