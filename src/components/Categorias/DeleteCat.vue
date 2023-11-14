<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="show.modalEliminarCat"
    title="Eliminar categoria"
    width="90%"
  >
    <div class="card-body">
      <h6 v-if="categoria" style="font-weight: 400; text-align: center">
        ¿Está seguro que quiere eliminar la categoria "{{
          categoria.nombre_categoria
        }}"?
      </h6>
    </div>
    <template #footer>
      <el-button @click="show.modalEliminarCat = false"> Cancelar </el-button>
      <el-button
        type="danger"
        @click="
          removeCategoria({ id: categoria.id });
          show.modalEliminarCat = false;
        "
      >
        Eliminar
      </el-button>
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
    categoryProp: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      categoria: {},
    };
  },
  computed: {},
  watch: {
    categoryProp: {
      deep: true,
      handler(newValue) {
        if (Object.keys(newValue).length === 0) return;
        this.categoria = newValue;
      },
    },
  },
  methods: {
    ...mapActions("categorias", ["removeCategoria"]),
  },
};
</script>
