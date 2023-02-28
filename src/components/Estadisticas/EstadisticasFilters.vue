<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-drawer
    v-model="show.estadisticasFilterDrawer"
    title="Filtro para ordenes"
    direction="btt"
    size="80%"
  >
    <el-form
      label-position="top"
    >
      <el-form-item label="Fecha">
        <el-radio-group v-model="dateType" size="large">
          <el-radio-button label="Por día" />
          <el-radio-button label="Por rango" />
        </el-radio-group>
        <el-col v-if="dateType === 'Por día'" :span="24">
          <el-date-picker
            v-model="filters.date.start"
            type="date"
            placeholder="Fecha de inicio"
            format="DD/MM/YYYY"
            :disabled-date="disabledStartDate"
          />
        </el-col>
        <el-row v-else>
          <el-col :span="10">
            <el-date-picker
              v-model="filters.date.start"
              type="date"
              placeholder="Fecha de inicio"
              format="DD/MM/YYYY"
              :disabled-date="disabledStartDate"
            />
          </el-col>
          <el-col :span="4">
            <label v-if="dateType === 'Por rango'" style="text-align: center;">-</label>
          </el-col>
          <el-col :span="10">
            <el-date-picker
              v-if="dateType === 'Por rango'"
              v-model="filters.date.end"
              :disabled="filters.date.start === null"
              type="date"
              placeholder="Fecha de fin"
              format="DD/MM/YYYY"
              :disabled-date="disabledEndDate"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="users != null" label="Tipo de filtro">
        <el-radio-group v-model="filters.typeOfFilter" size="large">
          <el-radio-button label="Por usuario" />
          <el-radio-button label="Por cede" />
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="users != null && filters.typeOfFilter === 'Por usuario'" label="Seleccionar usuario">
        <el-select v-model="filters.userSelected" placeholder="Seleccione un usuario" size="large">
          <el-option
            label="Todos los usuarios"
            value="Todos"
          />
          <el-option
            v-if="user.role === 'manager'"
            :label="user.name"
            :value="user.name"
          >
            <span style="float: left">{{ user.name }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
            >{{ user.orgDiv }}</span
            >
          </el-option>
          <el-option
            v-for="item in users"
            :key="item._id"
            :label="item.name"
            :value="item.name"
          >
            <span style="float: left">{{ item.name }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
            >{{ item.organization_unit }}</span
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="users != null && filters.typeOfFilter === 'Por cede' && organizationUnits != null"
        label="Seleccionar una cede"
      >
        <el-select v-model="filters.orgDivSelected" placeholder="Seleccione una cede" size="large">
          <el-option
            v-for="item in organizationUnits"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="clearFilters();show.estadisticasFilterDrawer = false">Limpiar filtros</el-button>
        <el-button type="success" @click="confirmClick();">Aplicar filtros</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script>
import { mapActions } from "vuex";

function initialState() {
  return {
    dateType: "Por día",
    filters: {
      date: {
        start: new Date(),
        end: null,
      },
      price: {
        priceLte: 0.0,
        priceGte: 0.0,
      },
      userSelected: "Todos",
      typeOfFilter: "Por usuario",
      orgDivSelected: null,
    },
    users: null,
    user: {
      name: null,
      role: null,
      orgDiv: null,
    },
  };
}


export default {
  name: "EstadisticaFilters",
  props: {
    show: {
      type: Object,
      required: true,
    },
  },
  emits: ["filtersConfirmed"],
  data() {
    return initialState();
  },
  computed: {
    organizationUnits() {
      if (this.users == null) return null;
      let orgDiv = this.users.map((user) => user.organization_unit);
      orgDiv = [...new Set(orgDiv)];
      return orgDiv
    },
  },
  watch: {
    dateType() {
      this.filters.date.start = null;
    },
    "filters.date.start": function resetEndDate() {
      this.filters.date.end = null;
    },
    "filters.typeOfFilter": function resetUserSelected(newValue) {
      if (newValue === "Por cede") this.filters.userSelected = "Todos";
    },
  },
  async created() {
    this.users = await this.getAllUsuarios();
    if (this.users == null) this.filters.userSelected = localStorage.getItem("user_name");
    this.filters.orgDivSelected = localStorage.getItem("org_division");
    this.user.name = localStorage.getItem("user_name");
    this.user.role = localStorage.getItem("role");
    this.user.orgDiv = localStorage.getItem("org_division");
  },
  methods: {
    ...mapActions("usuarios", ["getAllUsuarios"]),
    disabledStartDate(time) {
      return time.getTime() > Date.now();
    },
    disabledEndDate(time) {
      // 2023-02-03T05:59:59.999Z
      if (this.filters.date.start == null) return true;
      return time.getTime() < this.filters.date.start || time.getTime() > Date.now();
    },
    confirmClick() {
      const options = { ...this.filters };
      this.$emit("filtersConfirmed", options);
      // eslint-disable-next-line
      this.show.estadisticasFilterDrawer = false;
    },
    clearFilters() {
      Object.assign(this.$data, initialState());
      this.confirmClick();
    },
  },
}
</script>

<style>
form > div > div, form > div > label {
  justify-content: center;
  text-align: center!important;
}

div:global(.el-date-editor.el-input), div:global(.el-date-editor.el-input__wrapper) {
  width: fit-content;
  height: fit-content;
}
.numberInput {
  width: 100%;
  border-color: #a8abb2;
  border-style: solid;
  border-width: thin;
  text-align: center;
}
</style>