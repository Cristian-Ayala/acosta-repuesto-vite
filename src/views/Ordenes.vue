<template>
  <div id="domVue" class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Ordenes
            </h6>
            <el-button type="success" style="float: right" @click="show.detOrden = true">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </el-button>
          </div>
          <div class="card-body">
            <div class="filtros">
              <div class="d-inline-flex pr-2 pb-2">
                <el-button type="primary" round @click="show.orderFilterDrawer = true"
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
                  @click="show.orderFilterDrawer = true"
                >
                  {{ filter }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <div style="display: grid;grid-template-columns: 1fr 1fr;">
          <order-view
            v-for="orden in ordenes"
            :key="orden._id"
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
          :total="totalRows"
          :page-size="pagination.limit"
          hide-on-single-page
        />
      </div>
    </div>
    <!-- Fin del Cuerpo a escribir -->
    <nueva-orden v-if="show.detOrden" :show="show" @clear-order-filters="clearOrderFilters()"></nueva-orden>
    <!-- eslint-disable-next-line vue/v-on-function-call -->
    <order-filters ref="filterOder" :show="show" @filters-confirmed="filtersConfirmed"></order-filters>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import NuevaOrden from '@/components/Ordenes/NuevaOrden.vue';
import OrderView from '@/components/Ordenes/OrderView.vue';
import OrderFilters from '@/components/Ordenes/OrderFilters.vue';

export default {
  name: 'OrdenesIndex',
  components: {
    OrderView,
    NuevaOrden,
    OrderFilters,
  },
  data: () => ({
      show: {
        detOrden: false,
        orderFilterDrawer: false,
      },
      filtersArray: {
        date: {
          start: null,
          end: null,
        },
        price: {
          priceLte: 0.0,
          priceGte: 0.0,
        },
        orderType: 'Todas',
        tipoDistribucion: 'Todas',
        status: 'Todas',
      },
      pagination: {
        page: 1,
        limit: 10,
      },
  }),
  computed: {
    ...mapState('ordenes', ['ordenes', 'ordSelected', 'showDetOrd', 'totalRows']),
    allFilters() {
      const filters = [];
      if (this.filtersArray.date.end != null) filters.push(`Antes de: ${new Date(this.filtersArray.date.end).toLocaleDateString()}`);
      if (this.filtersArray.date.start != null && this.filtersArray.date.end != null) filters.push(`Despues de: ${new Date(this.filtersArray.date.start).toLocaleDateString()}`);
      else filters.push(`Día: ${new Date().toLocaleDateString()}`);
      if (this.filtersArray.price.priceLte != null && this.filtersArray.price.priceLte !== 0) filters.push(`<= $${this.filtersArray.price.priceLte}`);
      if (this.filtersArray.price.priceGte != null && this.filtersArray.price.priceGte !== 0) filters.push(`>= $${this.filtersArray.price.priceGte}`);
      if (this.filtersArray.orderType !== 'Todas') filters.push(this.filtersArray.orderType);
      if (this.filtersArray.tipoDistribucion !== 'Todas') filters.push(this.filtersArray.tipoDistribucion);
      if (this.filtersArray.status !== 'Todas') filters.push(this.filtersArray.status);
      return filters;
    },
  },
  watch: {
    'pagination.page': function handler(newPage) {
      this.pagination.page = newPage;
      this.updateOrders();
    },
  },
  created() {
    this.readAllOrdenes({ pagination: this.pagination});
  },
  methods: {
    ...mapMutations('ordenes', ['clickRow']),
    ...mapActions('ordenes', ['readAllOrdenes']),
    filtersConfirmed(filters) {
      this.filtersArray = { ...filters };
      this.readAllOrdenes({ ...this.filtersArray, pagination: this.pagination});
    },
    clearOrderFilters() {
      this.$refs.filterOder.clearFilters();
    },
    updateOrders() {
      this.readAllOrdenes({ ...this.filtersArray, pagination: this.pagination});
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
}
.card-header {
  box-shadow: none
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