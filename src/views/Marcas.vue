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
              circle
              @click="
                clearData();
                show.modalAgregarMar = true;
              "
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
                v-model="searchDisplay"
                type="search"
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
                <tr v-for="(mar, index) in marcas" :key="index">
                  <td>{{ mar.nombre_marca }}</td>
                  <td class="onlyOnWeb">{{ mar.descripcion_marca }}</td>
                  <td>
                    <el-button
                      type="danger"
                      circle
                      @click="
                        setMarcaSelected(mar);
                        show.modalEliminarMar = true;
                      "
                    >
                      <i class="fas fa-times" aria-hidden="true"></i>
                    </el-button>
                    <el-button
                      type="warning"
                      circle
                      @click="
                        setMarcaSelected(mar);
                        show.modalAgregarMar = true;
                      "
                    >
                      <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <el-skeleton v-if="marcas.length === 0" :rows="4" animated />
          </div>
        </div>
      </div>
      <agregar-mar
        :show="show"
        :marca-prop="marcaSelected"
        @clear-marca-selected="() => (marcaSelected = {})"
      ></agregar-mar>
      <delete-mar
        :show="show"
        :marca-prop="marcaSelected"
        @clear-marca-selected="() => (marcaSelected = {})"
      ></delete-mar>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

// TODO: Filtrar las marcas
// TODO: Paginacion
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Marcas",
  components: {
    AgregarMar: () => import("@/components/Marcas/AgregarMar.vue"),
    // DeleteMar: () => import("@/components/Marcas/DeleteMar.vue"),
  },
  data: () => ({
    displayOption: "",
    searchDisplay: "",
    show: {
      modalAgregarMar: false,
      modalEliminarMar: false,
    },
    marcaSelected: {},
  }),
  computed: {
    ...mapState("marcas", ["marcas", "marca"]),
  },
  mounted() {
    this.$store.dispatch("marcas/getAll");
  },
  methods: {
    ...mapMutations("marcas", ["clearData"]),
    setMarcaSelected(marca) {
      const tmpMarca = JSON.parse(JSON.stringify(marca));
      delete tmpMarca.__typename;
      this.marcaSelected = tmpMarca;
    },
    // filtro(index) {
    //   if (this.searchDisplay === "") return true;
    //   const marcaBusqueda = (
    //     this.marcas[index].doc.nombreMarca + this.marcas[index].doc.descripMarca
    //   ).toUpperCase();
    //   return marcaBusqueda.indexOf(this.searchDisplay.toUpperCase()) >= 0;
    // },
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
