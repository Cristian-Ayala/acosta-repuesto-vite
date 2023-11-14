<template>
  <div id="domVue" class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Ordenes
            </h6>
          </div>
          <div class="card-body">
            <div class="filtros">
              <div class="d-inline-flex pr-2 pb-2">
                <el-button
                  type="primary"
                  round
                  @click="show.orderFilterDrawer = true"
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
                  @click="show.orderFilterDrawer = true"
                >
                  {{ filter }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="show.loadingOrders">
          <orden-view-loading v-for="i in 10" :key="i" />
        </div>
        <div v-else style="display: grid">
          <order-view
            v-for="orden in ordenes"
            :key="orden.id"
            :orden="orden"
            @update-orders="updateOrders()"
          ></order-view>
        </div>
        <el-empty v-if="ordenes.length === 0" description="No hay ordenes" />
      </div>
      <div class="mt-3" style="margin-left: -12px">
        <el-pagination
          v-model:currentPage="pagination.page"
          small
          background
          layout="prev, pager, next"
          :total="ordenesCount"
          :page-size="pagination.perPage"
          hide-on-single-page
        />
      </div>
    </div>
    <!-- Fin del Cuerpo a escribir -->
    <nueva-orden
      v-if="show.detOrden"
      :show="show"
      @clear-order-filters="clearOrderFilters()"
    ></nueva-orden>
    <order-filters
      ref="filterOder"
      :show="show"
      @filters-confirmed="filtersConfirmed"
    ></order-filters>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import NuevaOrden from "@/components/Ordenes/NuevaOrden.vue";
import OrderView from "@/components/Ordenes/OrderView.vue";
import OrderFilters from "@/components/Ordenes/OrderFilters.vue";

export default {
  name: "OrdenesIndex",
  components: {
    OrderView,
    NuevaOrden,
    OrderFilters,
  },
  data: () => ({
    show: {
      detOrden: false,
      orderFilterDrawer: false,
      loadingOrders: false,
    },
    filtersArray: {},
    pagination: {
      page: 1,
      perPage: 10,
    },
  }),
  computed: {
    ...mapState("ordenes", [
      "ordenes",
      "ordenesCount",
      "dropDownTypeOfOrder",
      "tipoDistribucionArray",
      "dropdownStatus",
    ]),
    allFilters() {
      const filters = [];
      if (this.filtersArray.date?.end != null)
        filters.push(
          `Antes de: ${new Date(
            this.filtersArray.date.end,
          ).toLocaleDateString()}`,
        );
      if (
        this.filtersArray.date?.start != null &&
        this.filtersArray.date?.end != null
      )
        filters.push(
          `Despues de: ${new Date(
            this.filtersArray.date.start,
          ).toLocaleDateString()}`,
        );
      else filters.push(`Día: ${new Date().toLocaleDateString()}`);
      if (
        this.filtersArray.price?.priceLte != null &&
        this.filtersArray.price?.priceLte !== 0
      )
        filters.push(`<= $${this.filtersArray.price?.priceLte}`);
      if (
        this.filtersArray.price?.priceGte != null &&
        this.filtersArray.price?.priceGte !== 0
      )
        filters.push(`>= $${this.filtersArray.price?.priceGte}`);
      if (this.filtersArray.orderTypeID) {
        const orderType = this.dropDownTypeOfOrder.find(
          ({ id }) => id === this.filtersArray.orderTypeID,
        );
        filters.push(orderType.name);
      }
      if (this.filtersArray.distributionTypeID) {
        const distType = this.tipoDistribucionArray.find(
          ({ id }) => id === this.filtersArray.distributionTypeID,
        );
        filters.push(distType.name);
      }
      if (this.filtersArray.statusID) {
        const status = this.dropdownStatus.find(
          ({ id }) => id === this.filtersArray.statusID,
        );
        filters.push(status.name);
      }
      return filters;
    },
  },
  watch: {
    "pagination.page": function handler(newPage) {
      this.pagination.page = newPage;
      this.updateOrders();
    },
  },
  mounted() {},
  methods: {
    ...mapMutations("ordenes", ["clickRow"]),
    ...mapActions("ordenes", ["readAllOrdenes"]),
    async filtersConfirmed(filters) {
      this.show.loadingOrders = true;
      await this.$store.dispatch("ordenes/GET_TYPES");
      this.filtersArray = { ...filters };
      await this.readAllOrdenes({
        ...this.filtersArray,
        limit: this.pagination.perPage,
        offset: this.pagination.perPage * (this.pagination.page - 1),
      });
      this.show.loadingOrders = false;
    },
    clearOrderFilters() {
      this.$refs.filterOder.clearFilters();
    },
    async updateOrders() {
      this.show.loadingOrders = true;
      await this.readAllOrdenes({
        ...this.filtersArray,
        limit: this.pagination.perPage,
        offset: this.pagination.perPage * (this.pagination.page - 1),
      });
      this.show.loadingOrders = false;
    },
  },
};
</script>

<style scoped>
.inp-cantidad {
  width: 3em;
  margin: 0;
  border: none;
  text-align: center;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
.card-header {
  box-shadow: none;
}
.card-body {
  padding: 0%;
}
.card {
  background-color: #f7f8fa;
}
.filtros {
  box-shadow: 1px 0.5rem 0.8rem rgb(0 0 0 / 10%);
  padding: 0.5rem;
  display: flex;
  border-radius: 0 0 1rem 1rem;
}
div:deep(.el-pagination.is-background.el-pagination--small) {
  justify-content: center;
}
div.filtros > div.d-inline-flex.auto-scroll.pb-2 {
  overflow-x: scroll;
}
</style>
