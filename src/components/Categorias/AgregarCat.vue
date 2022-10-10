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
            v-model="categoria.nombreCategoria"
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
            v-model="categoria.descripcion"
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
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AgregarCat',
  props: {
    show: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('categorias',['categoria']),
  },
  methods: {
    ...mapActions('categorias',['createRegistro']),
  },
};
</script>
