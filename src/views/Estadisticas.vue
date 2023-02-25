<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">Estadísticas</h6>

          </div>
          <div class="card-body">
            <div class="filtros">
              <div class="d-inline-flex pr-2 pb-2">
                <el-button type="primary" round @click="show.estadisticasFilterDrawer = true"
                >Filtros ({{ allFilters.length }})</el-button>
              </div>
              <div
                v-if="allFilters && allFilters.length > 0"
                class="d-inline-flex auto-scroll pb-2"
              >
                <el-button
                  v-for="filter in allFilters"
                  :key="filter"
                  type="primary"
                  round
                  disabled
                  class="btn-sm pr-2 pl-2"
                  @click="show.estadisticasFilterDrawer = true"
                >
                  {{ filter }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <el-col :span="24">
          <div class="statistic-card">
            <el-statistic :value="totalTillDate" :formatter="formatDecimal">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  {{totalTillDateLabel}}
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="statistic-card">
            <el-statistic :value="countTillDate">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Número de ordenes
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="statistic-card">
            <el-statistic :value="maxTotalOrder" :formatter="formatDecimal">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Orden con mayor monto
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="statistic-card">
            <el-statistic :value="minTotalOrder" :formatter="formatDecimal">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Orden con menor monto
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </div>
    </div>
    <!-- eslint-disable-next-line vue/v-on-function-call -->
    <estadisticas-filters ref="filterEstadistica" :show="show" @filters-confirmed="filtersConfirmed">
    </estadisticas-filters>
  </div>
</template>

<script>
import { mapActions } from "vuex";

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

export default {
  name: "EstadisticasView",
  data: () => ({
    totalTillDate: 0,
    countTillDate: 0,
    maxTotalOrder: 0,
    minTotalOrder: 0,
    show: {
      estadisticasFilterDrawer: false,
    },
    selectedDate: null,
    filtersQuery: {},
  }),
  computed: {
    totalTillDateLabel() {
      return "Venta Total del día";
    },
    allFilters() {
      const filters = [];
      if (arrayEquals(this.filtersQuery.startkey, this.filtersQuery.endkey)) filters.push(`${this.filtersQuery.startkey[2]}/${this.filtersQuery.startkey[1]}/${this.filtersQuery.startkey[0]}`);
      else {
        filters.push(`Desde: ${this.filtersQuery.startkey[2]}/${this.filtersQuery.startkey[1]}/${this.filtersQuery.startkey[0]}`);
        filters.push(`Hasta${this.filtersQuery.endkey[2]}/${this.filtersQuery.endkey[1]}/${this.filtersQuery.endkey[0]}`);
      }
      if (this.filtersQuery.typeOfFilter === "Por cede") filters.push(this.filtersQuery.orgDivSelected);
      else filters.push(this.filtersQuery.userSelected);
      return filters;
    },
  },
  created() {
    this.filtersConfirmed();
  },
  methods: {
    ...mapActions("estadisticas", ["getStatistics"]),
    getDateFormatQuery(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return [year, month, day];
    },
    getStartAndEndDate({ start, end }) {
      // eslint-disable-next-line no-param-reassign
      if (start == null) start = new Date();
      // eslint-disable-next-line no-param-reassign
      if (end == null) end = start;
      return {
        startkey: this.getDateFormatQuery(start),
        endkey: this.getDateFormatQuery(end),
      };
    },
    getUserSelected(usr) {
      if (usr != null) return usr;
      return localStorage.getItem("user_name");
    },
    setStatistics(res) {
      const tmpRes = res.rows[0].value || {};
      this.totalTillDate = tmpRes.sum;
      this.countTillDate = tmpRes.count;
      this.maxTotalOrder = tmpRes.max;
      this.minTotalOrder = tmpRes.min;
    },
    setToZero() {
      this.totalTillDate = 0;
      this.countTillDate = 0;
      this.maxTotalOrder = 0;
      this.minTotalOrder = 0;
    },
    async filtersConfirmed(params) {
      const dates = this.getStartAndEndDate(params?.date || { start: null });
      const filters = { ...dates, userSelected: this.getUserSelected(params?.userSelected) };
      filters.typeOfFilter = params?.typeOfFilter || null;
      if (filters.typeOfFilter === "Por cede") filters.orgDivSelected = params?.orgDivSelected;
      this.filtersQuery = filters;
      const res = await this.getStatistics(filters);
      if (res?.rows?.[0]?.value != null) this.setStatistics(res);
      else this.setToZero();
    },
    formatDecimal(value) {
      return `$${value.toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
.cuerpo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
:deep(.card-body) {
  min-height: 75vh;
  text-align: center;
  text-align: -webkit-center;
  /* Verticall align */
  flex-direction: column;
  display: flex;
  justify-content: center;
}
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  background: #fff;
  padding: 20px;
  background-color: var(--el-bg-color-overlay);
  margin-top: 1rem;
  box-shadow: 1px 0.5rem 0.8rem rgb(0 0 0 / 10%);
  border-radius: 1rem;
}
:deep(.el-statistic__head) {
  text-align: center;
}
.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}
.red {
  color: var(--el-color-error);
}
.el-col.el-col-24 {
  align-self: center;
  margin-top: 1rem;
}
:deep(.el-statistic__content) {
  text-align: center;
}
.card-header {
  box-shadow: none
}
.card-body {
  padding: 0%;
  min-height: 0;
}
.filtros {
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
  padding: 0.5rem;
  display: flex;
  border-radius: 0 0 1rem 1rem;
}
div.filtros > div.d-inline-flex.auto-scroll.pb-2 {
  overflow-x: scroll;
}
</style>