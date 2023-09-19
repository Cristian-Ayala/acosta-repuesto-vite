<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="show.modalAgregarMar"
    :title="`${marca?.id ? 'Editar' : 'Agregar'} Marca`"
    width="90%"
  >
    <div class="card-body">
      <div class="form-group row">
        <label class="col-md-3 form-control-label">Nombre</label>
        <div class="col-md-9">
          <input
            v-model.trim="marca.nombre_marca"
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
            v-model.trim="marca.descripcion_marca"
            class="form-control"
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show.modalAgregarMar = false"> Cancelar </el-button>
        <el-button type="primary" @click="createReg()"> Guardar </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AgregarMar",
  props: {
    show: {
      type: Object,
      required: true,
    },
    marcaProp: {
      type: Object,
      default: () => ({}),
    }
  },
  emits: ["clearMarcaSelected"],
  data() {
    return {
      marca: {
        nombre_marca: "",
        descripcion_marca: "",
      },
    };
  },
  watch: {
    marcaProp: {
      deep: true,
      handler(newValue) {
        if (Object.keys(newValue).length === 0) return;
        if (newValue?.clearProp) {
          this.marca = {};
        } else {
          this.marca = newValue;
        }
      }
    }
  },
  beforeUnmount() {
    this.$emit("clearMarcaSelected");
  },
  methods: {
    ...mapActions("marcas", ["createUpdateRegistro"]),
    createReg() {
      this.marca.nombre_marca = this.marca.nombre_marca.toLocaleUpperCase();
      this.createUpdateRegistro({ marca: this.marca });
      /* eslint-disable vue/no-mutating-props */
      this.show.modalAgregarMar = false;
    },
  },
};
</script>
