<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-drawer
    v-model="show.estadisticasFilterDrawer"
    title="Filtro de estadísticas"
    direction="btt"
    size="80%"
  >
    <el-form label-position="top">
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
            <label v-if="dateType === 'Por rango'" style="text-align: center"
              >-</label
            >
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
      <el-form-item
        v-if="users != null && users.length > 1"
        label="Seleccionar usuario"
      >
        <el-select
          v-model="filters.userSelected"
          placeholder="Seleccione un usuario"
          size="large"
        >
          <el-option label="Todos los usuarios" value="Todos" />
          <el-option
            v-for="item in users"
            :key="item.id"
            :label="item.created_by"
            :value="item.created_by"
          >
            <span style="float: left">{{ item.created_by }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
              >{{ item.cede }}</span
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="organizationUnits != null && organizationUnits.length > 1"
        label="Seleccionar una cede"
      >
        <el-select
          v-model="filters.orgDivSelected"
          placeholder="Seleccione una cede"
          size="large"
        >
          <el-option label="Todas las cedes" value="Todos" />
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
        <el-button
          @click="
            clearFilters();
            show.estadisticasFilterDrawer = false;
          "
          >Limpiar filtros</el-button
        >
        <el-button type="success" @click="confirmClick()"
          >Aplicar filtros</el-button
        >
      </div>
    </template>
  </el-drawer>
</template>

<script>
import { mapState } from "vuex";

function initialState(userProfile) {
  return {
    dateType: "Por día",
    filters: {
      date: {
        start: new Date(),
        end: null,
      },
      userSelected: userProfile?.email,
      orgDivSelected: userProfile?.sucursal[0],
    },
    users: [],
    user: {
      name: userProfile?.email,
      role: userProfile?.defaultRole,
      orgDiv: userProfile?.locationSelected,
    },
    organizationUnits: userProfile?.sucursal,
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
    return initialState(this.userProfile);
  },
  computed: {
    ...mapState("auth", ["userProfile"]),
  },
  watch: {
    dateType() {
      this.filters.date.start = null;
    },
    "filters.date.start": function resetEndDate() {
      this.filters.date.end = null;
    },
    organizationUnits: {
      async handler(cedes) {
        if (!cedes || this.user.role !== "gerente_area") return;
        [this.filters.orgDivSelected] = cedes;
        this.users = await this.$store.dispatch("estadisticas/GET_USERS", {
          cedes,
        });
      },
      immediate: true,
    },
    userProfile: {
      handler(profile) {
        if (!profile) return;
        Object.assign(this.$data, initialState(profile));
        this.confirmClick();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    disabledStartDate(time) {
      return time.getTime() > Date.now();
    },
    disabledEndDate(time) {
      // 2023-02-03T05:59:59.999Z
      if (this.filters.date.start == null) return true;
      return (
        time.getTime() < this.filters.date.start || time.getTime() > Date.now()
      );
    },
    confirmClick() {
      const options = { ...this.filters };
      if (options.userSelected === "Todos") options.userSelected = null;
      if (options.orgDivSelected === "Todos")
        options.orgDivSelected = this.organizationUnits;
      this.$emit("filtersConfirmed", options);
      // eslint-disable-next-line
      this.show.estadisticasFilterDrawer = false;
    },
    clearFilters() {
      Object.assign(this.$data, initialState(this.userProfile));
      this.confirmClick();
    },
  },
};
</script>

<style>
form > div > div,
form > div > label {
  justify-content: center;
  text-align: center !important;
}

div:global(.el-date-editor.el-input),
div:global(.el-date-editor.el-input__wrapper) {
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
