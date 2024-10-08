<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Categorias
            </h6>
            <el-button v-if="isAbleToModify" color="#28a745" circle @click="createBtn()">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </el-button>
          </div>
          <div class="card-body">
            <div class="form-group position-relative mb-0 flex-middle">
              <i class="fas fa-search text-gray"></i>
              <input
                :value="searchDisplay"
                type="search"
                placeholder="Buscar categorias..."
                class="form-control form-control-sm border-0 no-shadow pl-4"
                @input="filterCategorias"
              />
            </div>
            <table class="table card-text table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th v-if="isAbleToModify">Operaciones</th>
                </tr>
              </thead>
              <tbody v-if="categorias && !loadingTableCategoria">
                <tr v-for="(cat, index) in categorias" :key="index">
                  <td>{{ cat.nombre_categoria }}</td>
                  <td class="onlyOnWeb">{{ cat.descripcion_categoria }}</td>
                  <td v-if="isAbleToModify">
                    <el-button
                      type="danger"
                      circle
                      @click="
                        setCategoriaSelected(cat);
                        show.modalEliminarCat = true;
                      "
                    >
                      <i class="fas fa-times" aria-hidden="true"></i>
                    </el-button>
                    <el-button
                      type="warning"
                      circle
                      @click="
                        setCategoriaSelected(cat);
                        show.modalAgregarCat = true;
                      "
                    >
                      <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              class="mt-3"
              style="margin-left: -12px; justify-content: center"
            >
              <el-pagination
                v-show="!loadingTableCategoria"
                :page-size="pageSize"
                :current-page="page"
                layout="prev, pager, next"
                :total="categoriasCount"
                :hide-on-single-page="true"
                size="small"
                @current-change="handleChangePage($event)"
              />
            </div>
            <el-skeleton v-if="loadingTableCategoria" :rows="4" animated />
            <el-empty
              v-else-if="categorias.length === 0"
              description="Categorias no encontradas"
            />
          </div>
        </div>
      </div>
      <agregar-cat
        v-if="show.modalAgregarCat"
        :show="show"
        :category-prop="categoriaSelected"
      ></agregar-cat>
      <delete-cat
        v-if="show.modalEliminarCat"
        :show="show"
        :category-prop="categoriaSelected"
      ></delete-cat>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { defineAsyncComponent } from "vue";

export default {
  name: "CategoriasIndex",
  components: {
    AgregarCat: defineAsyncComponent(() =>
      import("@/components/Categorias/AgregarCat.vue"),
    ),
    DeleteCat: defineAsyncComponent(() =>
      import("@/components/Categorias/DeleteCat.vue"),
    ),
  },
  data: () => ({
    displayOption: "",
    searchDisplay: "",
    show: {
      modalAgregarCat: false,
      modalEliminarCat: false,
    },
    categoriaSelected: {},
    debounceTimer: null,
    page: 1,
    pageSize: 10,
  }),
  computed: {
    ...mapState("auth", ["isAbleToModify"]),
    ...mapState("categorias", [
      "categorias",
      "categoriasCount",
      "loadingTableCategoria",
    ]),
  },
  watch: {
    page() {
      this.fetchCategorias();
    },
  },
  mounted() {
    this.fetchCategorias();
  },
  methods: {
    ...mapActions("categorias", ["getCategorias"]),
    setCategoriaSelected(categoria) {
      const tmpCategoria = JSON.parse(JSON.stringify(categoria));
      delete tmpCategoria.__typename;
      this.categoriaSelected = tmpCategoria;
    },
    createBtn() {
      this.categoriaSelected.clear = true;
      this.show.modalAgregarCat = true;
    },
    fetchCategorias(delay = 0) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        const searchVariables = {
          nombreCat: this.searchDisplay ? `%${this.searchDisplay}%` : "%%",
          limit: this.pageSize,
          offset: this.pageSize * (this.page - 1),
        };
        this.getCategorias(searchVariables);
      }, delay);
    },
    handleChangePage(currentPage) {
      this.page = currentPage;
    },
    filterCategorias(event) {
      this.page = 1;
      // reset the debounce timer if the user types a new letter
      if (this.debounceTimer) {
        this.searchDisplay = event?.target?.value || "";
        clearTimeout(this.debounceTimer);
      }
      this.fetchCategorias(500);
    }
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
div:deep(.el-pagination.is-background.el-pagination--small) {
  justify-content: center;
}
div:deep(.el-pagination.el-pagination--small) {
  place-content: center;
}
:global(footer.el-dialog__footer) {
  padding: var(--el-dialog-padding-primary);
}
:deep(ul.el-pager > li.number) {
  display: none;
}
:deep(ul.el-pager > li.number.is-active),
:deep(ul.el-pager > li:first-child),
:deep(ul.el-pager > li:last-child) {
  display: block;
}
:deep(ul.el-pager > li.more) {
  pointer-events: none;
}
</style>
