<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog v-model="showModal" title="Seleccionar Area" width="90%">
    <div class="card-body">
      <el-select v-model="areaSelected" placeholder="Seleccionar Area">
        <el-option
          v-for="item in areasDropdown"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('closeAreaSelection')"> Cancelar </el-button>
        <el-button type="primary" @click="seleccionarArea()"> Guardar </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "ChangeAreaSelected",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["closeAreaSelection"],
  data() {
    return {
      areaSelected: localStorage.getItem("locationSelected"),
      areasDropdown: JSON.parse(localStorage.getItem("sucursales")),
    };
  },
  computed: {
    showModal: {
      get() {
        return this.show;
      },
      set() {
        this.$emit("closeAreaSelection");
      },
    },
  },
  methods: {
    seleccionarArea() {
      localStorage.setItem("locationSelected", this.areaSelected);
      this.$emit("closeAreaSelection");
    }
  },
};
</script>
