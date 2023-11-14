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
              v-if="isAbleToModify"
              color="#28a745"
              circle
              @click="createNewMarca()"
            >
              <i class="fa fa-plus" aria-hidden="true"></i>
            </el-button>
          </div>
          <div class="card-body">
            <div class="form-group position-relative mb-0 flex-middle">
              <i class="fas fa-search text-gray"></i>
              <input
                v-model.trim="searchDisplay"
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
                  <th v-if="isAbleToModify">Operaciones</th>
                </tr>
              </thead>
              <tbody v-if="marcas">
                <tr
                  v-for="(mar, index) in marcas"
                  v-show="filtro(index)"
                  :key="index"
                >
                  <td>{{ mar.nombre_marca }}</td>
                  <td class="onlyOnWeb">{{ mar.descripcion_marca }}</td>
                  <td v-if="isAbleToModify">
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
        v-if="show.modalAgregarMar"
        :show="show"
        :marca-prop="marcaSelected"
        @clear-marca-selected="() => (marcaSelected = {})"
        @get-all-marcas="getAllMarcas()"
      ></agregar-mar>
      <delete-mar
        v-if="show.modalEliminarMar"
        :show="show"
        :marca-prop="marcaSelected"
        @clear-marca-selected="() => (marcaSelected = {})"
        @get-all-marcas="getAllMarcas()"
      ></delete-mar>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { defineAsyncComponent } from "vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Marcas",
  components: {
    AgregarMar: defineAsyncComponent(() =>
      import("@/components/Marcas/AgregarMar.vue"),
    ),
    DeleteMar: defineAsyncComponent(() =>
      import("@/components/Marcas/DeleteMar.vue"),
    ),
  },
  data: () => ({
    displayOption: "",
    searchDisplay: "",
    show: {
      modalAgregarMar: false,
      modalEliminarMar: false,
    },
    marcas: [],
    marcaSelected: {},
  }),
  computed: {
    ...mapState("auth", ["isAbleToModify"]),
  },
  async mounted() {
    this.marcas = await this.$store.dispatch("marcas/getAll");
  },
  methods: {
    setMarcaSelected(marca) {
      const tmpMarca = JSON.parse(JSON.stringify(marca));
      delete tmpMarca.__typename;
      this.marcaSelected = tmpMarca;
    },
    filtro(index) {
      if (this.searchDisplay === "") return true;
      const marcaBusqueda = (
        this.marcas[index].nombre_marca + this.marcas[index].descripcion_marca
      ).toUpperCase();
      return marcaBusqueda.indexOf(this.searchDisplay.toUpperCase()) >= 0;
    },
    createNewMarca() {
      this.marcaSelected.clearProp = true;
      this.show.modalAgregarMar = true;
    },
    async getAllMarcas() {
      this.marcas = await this.$store.dispatch("marcas/getAll");
    },
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
