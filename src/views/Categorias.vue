<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Categorias
            </h6>
            <el-button color="#28a745" @click="show.modalAgregarCat = true" circle>
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
                placeholder="Buscar categorias..."
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
              <tbody v-if="categorias">
                <tr
                  v-for="(cat, index) in categorias"
                  v-show="filtro(index)"
                  :key="index"
                >
                  <th scope="row" class="onlyOnWeb">{{ index + 1 }}</th>
                  <td>{{ cat.doc.nombreCategoria }}</td>
                  <td class="onlyOnWeb">{{ cat.doc.descripcion }}</td>
                  <td>
                    <el-button type="danger" circle @click="getCategoriaSelected(cat);show.modalEliminarCat = true">
                      <i class="fas fa-times" aria-hidden="true"/>
                    </el-button>
                    <el-button type="warning" circle @click="getCategoriaSelected(cat);show.modalEditCat = true">
                      <i class="fas fa-pencil-alt" aria-hidden="true"/>
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <el-skeleton :rows="4" animated v-if="categorias.length === 0"/>
          </div>
        </div>
      </div>
      <AgregarCat :show="show"></AgregarCat>
      <DeleteCat :show="show"></DeleteCat>
      <EditCat :show="show"></EditCat>
    </div>
  </div>
</template>

<script>
import AgregarCat from "@/components/Categorias/AgregarCat.vue";
import DeleteCat from "@/components/Categorias/DeleteCat.vue";
import EditCat from "@/components/Categorias/EditCat.vue";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Categorias",
  components: {
    AgregarCat,
    DeleteCat,
    EditCat,
  },
  data: () => {
    return {
      displayOption: "",
      searchDisplay: "",
      urlApi: `http://localhost:8080/categoria`,
      show: {
        modalAgregarCat: false,
        modalEditCat: false,
        modalEliminarCat: false,
      }
    };
  },
  methods: {
    ...mapMutations("categorias", ["clearDataCat", "getCategoriaSelected"]),
    filtro(index) {
      if (this.searchDisplay === "") return true;
      let array = (
        this.categorias[index].doc.nombreCat +
        this.categorias[index].doc.descripcion
      ).toUpperCase();
      return array.indexOf(this.searchDisplay.toUpperCase()) >= 0;
    },
  },
  computed: {
    ...mapState("categorias", ["categorias", "categoria"]),
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
