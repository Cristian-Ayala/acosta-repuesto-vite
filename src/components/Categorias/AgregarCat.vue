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
          />
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
      <el-button type="primary" @click="performAction()"> Guardar </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  name: "AgregarCat",
  props: {
    show: {
      type: Object,
      required: true,
    },
    categoryProp: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["setCategoriaSelected"],
  data() {
    return {
      categoria: {
        nombre_categoria: "",
        descripcion_categoria: "",
      },
    };
  },
  computed: {},
  watch: {
    categoryProp: {
      deep: true,
      immediate: true,
      handler(newValue) {
        if (Object.keys(newValue).length === 0) return;
        if (newValue.clear) {
          this.categoria = {
            nombre_categoria: "",
            descripcion_categoria: "",
          };
        } else {
          this.categoria = newValue;
        }
      },
    },
  },
  methods: {
    ...mapMutations("common", ["errorNotification"]),
    ...mapActions("categorias", ["createCategory", "editCategory"]),
    async performAction() {
      if (
        !this.categoria.nombre_categoria ||
        this.categoria.nombre_categoria.trim() === ""
      ) {
        this.errorNotification(
          "Por favor, introduce un nombre para la categoria.",
        );
        return;
      }
      this.categoria.nombre_categoria = this.categoria.nombre_categoria
        .trim()
        .toLocaleUpperCase();
      if (this.categoria.id) {
        await this.editCategory({ categoria: this.categoria });
      } else {
        const res = await this.createCategory({ categoria: this.categoria });
        this.$emit("setCategoriaSelected", res);
      }
      /* eslint-disable vue/no-mutating-props */
      this.show.modalAgregarCat = false;
    },
  },
};
</script>
