<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Marcas
            </h6>
            <el-button
              color="#28a745"
              @click="
                clearData();
                show.modalAgregarMar = true;
              "
              circle
            >
              <i class="fa fa-plus" aria-hidden="true"></i>
            </el-button>
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
                type="search"
                v-model="searchDisplay"
                placeholder="Buscar marca..."
                class="form-control form-control-sm border-0 no-shadow pl-4"
              />
            </div>
            <table class="table card-text table-hover">
              <thead>
                <tr>
                  <th class="onlyOnWeb">#</th>
                  <th>Nombre</th>
                  <th class="onlyOnWeb">Descripción</th>
                  <th>Operaciones</th>
                </tr>
              </thead>
              <tbody v-if="marcas">
                <tr
                  v-for="(mar, index) in marcas"
                  v-show="filtro(index)"
                  :key="mar.doc.nombreMarca"
                >
                  <th scope="row" class="onlyOnWeb">{{ index + 1 }}</th>
                  <td>{{ mar.doc.nombreMarca }}</td>
                  <td class="onlyOnWeb">{{ mar.doc.descripMarca }}</td>
                  <td>
                    <el-button
                      type="danger"
                      circle
                      @click="
                        getMarcaSelected(mar);
                        show.modalEliminarMar = true;
                      "
                    >
                      <i class="fas fa-times" aria-hidden="true" />
                    </el-button>
                    <el-button
                      type="warning"
                      circle
                      @click="
                        getMarcaSelected(mar);
                        show.modalEditarMar = true;
                      "
                    >
                      <i class="fas fa-pencil-alt" aria-hidden="true" />
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <el-skeleton :rows="4" animated v-if="marcas.length === 0" />
          </div>
        </div>
      </div>
      <AgregarMar :show="show"></AgregarMar>
      <DeleteMar :show="show"></DeleteMar>
      <EditMar :show="show"></EditMar>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import AgregarMar from '@/components/Marcas/AgregarMar.vue';
import DeleteMar from '@/components/Marcas/DeleteMar.vue';
import EditMar from '@/components/Marcas/EditMar.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Marcas',
  components: {
    AgregarMar,
    DeleteMar,
    EditMar,
  },
  data: () => ({
    displayOption: '',
    searchDisplay: '',
    show: {
      modalAgregarMar: false,
      modalEditarMar: false,
      modalEliminarMar: false,
    },
  }),
  methods: {
    ...mapMutations('marcas', ['clearData', 'getMarcaSelected']),
    filtro(index) {
      if (this.searchDisplay === '') return true;
      const marcaBusqueda = (
        this.marcas[index].doc.nombreMarca + this.marcas[index].doc.descripMarca
      ).toUpperCase();
      return marcaBusqueda.indexOf(this.searchDisplay.toUpperCase()) >= 0;
    },
  },
  computed: {
    ...mapState('marcas', ['marcas', 'marca']),
  },
};
</script>
<style scoped>
.el-button.is-circle {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
}
</style>
