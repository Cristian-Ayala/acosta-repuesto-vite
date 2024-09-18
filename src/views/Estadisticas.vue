<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Estadísticas
            </h6>
          </div>
          <div class="card-body">
            <div class="filtros">
              <div class="d-inline-flex pr-2 pb-2">
                <el-button
                  type="primary"
                  round
                  @click="show.estadisticasFilterDrawer = true"
                  >Filtros ({{ allFilters.length }})</el-button
                >
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
                  Venta Total
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
          <div class="statistic-card" style="margin-bottom: 2rem">
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
    <estadisticas-filters
      ref="filterEstadistica"
      :show="show"
      @filters-confirmed="filtersConfirmed"
    >
    </estadisticas-filters>
  </div>
</template>

<script>
import { mapActions } from "vuex";

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
    loading: null,
  }),
  computed: {
    allFilters() {
      const filters = [];
      if (this.isSameDay(this.filtersQuery.fromDate, this.filtersQuery.toDate))
        filters.push(this.getDayMonthYear(this.filtersQuery.fromDate));
      else {
        filters.push(
          `Desde: ${this.getDayMonthYear(this.filtersQuery.fromDate)}`,
        );
        filters.push(`Hasta${this.getDayMonthYear(this.filtersQuery.toDate)}`);
      }
      filters.push(this.filtersQuery.orgDivSelected);
      filters.push(
        this.filtersQuery.createdBy != null
          ? this.filtersQuery.createdBy
          : "Todos los empleados",
      );
      return filters;
    },
  },
  methods: {
    ...mapActions("estadisticas", ["GET_STATISTICS"]),
    getStartAndEndDate({ start, end }) {
      /* eslint-disable no-param-reassign */
      if (typeof start === "string") start = new Date(start);
      else if (start == null) start = new Date();
      if (typeof end === "string") end = new Date(end);
      else if (end == null) end = start;
      return {
        fromDate: new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate(),
          0,
          0,
          0,
          0,
        ).toISOString(),
        toDate: new Date(
          end.getFullYear(),
          end.getMonth(),
          end.getDate(),
          23,
          59,
          59,
          999,
        ).toISOString(),
      };
    },
    setStatistics(res) {
      this.totalTillDate = res.totalOrdenes || 0.00001;
      this.countTillDate = res.numeroOrdenes || 0.00001;
      this.maxTotalOrder = res.maxTotal || 0.00001;
      this.minTotalOrder = res.minTotal || 0.00001;
    },
    setToZero() {
      this.totalTillDate = 0.00001;
      this.countTillDate = 0.00001;
      this.maxTotalOrder = 0.00001;
      this.minTotalOrder = 0.00001;
    },
    async filtersConfirmed(params) {
      this.$nextTick(() => {
        this.loading = this.$loading({ fullscreen: true });
      });
      const dates = this.getStartAndEndDate(params?.date || { start: null });
      const filters = {
        ...dates,
        createdBy: params?.userSelected?.creation_user?.id,
        orgDivSelected: params?.orgDivSelected,
      };
      if (Array.isArray(params?.orgDivSelected))
        filters.orgDivSelected = "Todas las cedes";
      this.filtersQuery = JSON.parse(JSON.stringify(filters));
      this.filtersQuery.createdBy = params?.userSelected?.creation_user?.email;
      let cedesSelected = filters.orgDivSelected;
      if (cedesSelected === "Todas las cedes") {
        delete filters.orgDivSelected;
        cedesSelected = null;
      } else if (typeof cedesSelected === "string") {
        cedesSelected = [cedesSelected];
      }
      filters.cedes = cedesSelected;
      const res = await this.GET_STATISTICS(filters);
      if (res != null) this.setStatistics(res);
      else this.setToZero();
      this.loading.close();
    },
    formatDecimal(value) {
      if (!value) return null;
      return `$${value.toFixed(2)}`;
    },
    isSameDay(date1, date2) {
      date1 = new Date(date1);
      date2 = new Date(date2);
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    },
    getDayMonthYear(date) {
      date = new Date(date);
      const day = date.getDate();
      const month = date.getMonth() + 1; // Adding 1 because getMonth returns 0-indexed values (0-11).
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
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
  box-shadow: none;
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
