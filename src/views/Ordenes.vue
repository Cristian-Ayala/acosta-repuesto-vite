<template>
  <div id="domVue" class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Ordenes
            </h6>
            <b-button
              v-b-modal.nuevaOrden
              variant="success"
              style="float: right"
            ><i class="fa fa-plus" aria-hidden="true"></i
            ></b-button>
          </div>
          <div class="card-body">
            <div class="form-group position-relative mb-0">
              <button
                type="submit"
                style="top: -3px; left: 0"
                class="position-absolute bg-white border-0 p-0"
              >
                <i class="o-search-magnify-1 text-gray text-lg"></i>
              </button>
              <input
                v-model="searchDisplay"
                type="search"
                placeholder="Buscar orden..."
                class="form-control form-control-sm border-0 no-shadow pl-4"
                style="border-radius: 0 0 1rem 1rem;"
              >
            </div>
          </div>
        </div>
        <order-view v-for="orden in ordenes" :key="orden.id" :orden="orden.doc"></order-view>
      </div>
      <button
        id="btnDetOrden"
        type="button"
        class="btn btn-danger"
        data-toggle="modal"
        data-target="#detalleOrden"
        hidden
      >
        <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
    </div>
    <!-- Fin del Cuerpo a escribir -->
    <nueva-orden></nueva-orden>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import NuevaOrden from '@/components/Ordenes/NuevaOrden.vue';
import OrderView from '../components/Ordenes/OrderView.vue';

export default {
  name: 'OrdenesIndex',
  components: {
    NuevaOrden,
    OrderView,
  },
  data: () => ({
      displayOption: '',
      searchDisplay: '',
  }),
  computed: {
    ...mapState('ordenes', ['ordenes', 'ordSelected', 'showDetOrd',]),
  },
  methods: {
    ...mapMutations('ordenes', ['clickRow']),
    filtro(valor) {
      if (this.searchDisplay.trim() === '') return true;
      const array = (
        this.ordenes[valor].idOrden +
        this.ordenes[valor].observacionesOrden +
        this.ordenes[valor].totalOrden +
        this.ordenes[valor].nombreCliente
      ).toUpperCase();
      return array.indexOf(this.searchDisplay.toUpperCase()) >= 0;
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
.card-body {
  padding: 0%;
}
.card {
    background-color: #f7f8fa;
}
</style>