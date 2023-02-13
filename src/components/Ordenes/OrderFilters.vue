<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-drawer
    v-model="show.orderFilterDrawer"
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
      <el-form-item label="Precio">
        <el-row>
          <el-col :span="10">
            <input v-model.number="filters.price.priceGte" type="number" class="numberInput">
          </el-col>
          <el-col :span="4">
            <label style="text-align: center;">-</label>
          </el-col>
          <el-col :span="10">
            <input v-model.number="filters.price.priceLte" type="number" class="numberInput">
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="Tipo de orden">
        <el-radio-group v-model="filters.orderType" size="large">
          <el-radio-button label="Local" />
          <el-radio-button label="Delivery" />
          <el-radio-button label="Todas" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Tipo de distribución">
        <el-radio-group v-model="filters.tipoDistribucion" size="large">
          <el-radio-button label="Mayoreo" />
          <el-radio-button label="Público" />
          <el-radio-button label="Taller" />
          <el-radio-button label="Todas" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Estado de la orden">
        <el-radio-group v-model="filters.status" size="large">
          <el-radio-button label="En proceso" />
          <el-radio-button label="Completado" />
          <el-radio-button label="Todas" />
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="clearFilters();show.orderFilterDrawer = false">Limpiar filtros</el-button>
        <el-button type="success" @click="confirmClick();">Aplicar filtros</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script>
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
      orderType: "Todas",
      tipoDistribucion: "Todas",
      status: "Todas",
    },
  };
}


export default {
  name: "OrderFilters",
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
  watch: {
    dateType() {
      this.filters.date.start = null;
    },
    "filters.date.start": function resetEndDate() {
      this.filters.date.end = null;
    },
  },
  methods: {
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
      if (typeof(options.price.priceGte) !== "number") options.price.priceGte = 0;
      if (typeof(options.price.priceLte) !== "number") options.price.priceLte = 0;
      this.$emit("filtersConfirmed", options);
      // eslint-disable-next-line
      this.show.orderFilterDrawer = false;
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