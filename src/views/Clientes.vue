<template>
  <div id="domVue" class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Clientes
            </h6>
            <el-button
              color="#28a745"
              style="float: right"
              circle
              @click="createClient()"
            >
              <i class="fa fa-plus" aria-hidden="true"></i>
            </el-button>
          </div>
          <div class="card-body">
            <div
              class="form-group mb-0 flex-middle"
              style="
                padding-left: 1rem;
                background: #fff;
                border-radius: 0 0 1rem 1rem;
              "
            >
              <i class="fas fa-search text-gray"></i>
              <input
                :value="searchKeyword"
                type="search"
                placeholder="Buscar cliente..."
                class="form-control form-control-sm border-0 no-shadow pl-4"
                @input="filterClientes"
              />
            </div>
          </div>
        </div>
        <div v-if="show.clientTableLoading">
          <clientes-view-loading v-for="i in 10" :key="i" />
        </div>
        <div v-else style="display: grid">
          <client-view
            v-for="(cliente, index) in clientes"
            :key="index"
            :client="cliente"
            @open-edit-modal="editClient(cliente)"
            @open-delete-modal="deleteClient(cliente)"
          ></client-view>
          <el-empty
            v-if="clientes.length === 0"
            description="No hay registros"
          />
          <div class="mt-3 mb-2" style="margin-left: -12px">
            <el-pagination
              :current-page="pagination.page"
              size="small"
              background
              layout="prev, pager, next"
              :total="totalClientes"
              :page-size="pagination.perPage"
              hide-on-single-page
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Fin del Cuerpo a escribir -->
    <create-edit-client
      :title="title"
      :mostrar="show"
      :client-selected="clientSelected"
      @close-modal-and-refresh="closeModalAndRefresh()"
    ></create-edit-client>
    <delete-client
      :show="show"
      :client-prop="clientSelected"
      @cliente-deleted="clienteDeleted()"
    ></delete-client>
  </div>
</template>

<script>
import ClientView from "@/components/Clientes/ClientesView.vue";
import ClientesViewLoading from "@/components/Clientes/ClientesViewLoading.vue";
import CreateEditClient from "@/components/Clientes/CreateEditClient.vue";
import DeleteClient from "@/components/Clientes/DeleteClient.vue";

export default {
  name: "ClientesIndex",
  components: {
    ClientView,
    ClientesViewLoading,
    CreateEditClient,
    DeleteClient,
  },
  props: {},
  data() {
    return {
      searchKeyword: "",
      show: {
        orderFilterDrawer: false,
        clientTableLoading: false,
        modalAddEditClient: false,
        modalDeleteClient: false,
      },
      clientes: [],
      totalClientes: 0,
      title: "",
      clientSelected: {},
      debounceTimer: null,
      pagination: {
        page: 1,
        perPage: 10,
      },
    };
  },
  computed: {},
  watch: {
    "pagination.page": function handler(newPage) {
      this.pagination.page = newPage;
      const keyword =
        this.searchKeyword != null && this.searchKeyword !== ""
          ? `%${this.searchKeyword}%`
          : null;
      this.getClientes({ keyword });
    },
  },
  mounted() {
    this.getClientes({ keyword: null });
  },
  methods: {
    async getClientes(keywordFilter) {
      this.show.clientTableLoading = true;
      const res = await this.$store.dispatch("clientes/getAllClients", {
        ...keywordFilter,
        limit: this.pagination.perPage,
        offset: this.pagination.perPage * (this.pagination.page - 1),
      });
      this.clientes = res.clientes;
      this.totalClientes = res.totalClientes;
      this.show.clientTableLoading = false;
    },
    createClient() {
      this.clientSelected = { CLEAR: true };
      this.title = "Agregar Cliente";
      this.show.modalAddEditClient = true;
    },
    editClient(client) {
      this.clientSelected = client;
      this.title = "Editar Cliente";
      this.show.modalAddEditClient = true;
    },
    deleteClient(client) {
      this.clientSelected = client;
      this.show.modalDeleteClient = true;
    },
    closeModalAndRefresh() {
      this.show.modalAddEditClient = false;
      this.getClientes({});
    },
    clienteDeleted() {
      this.show.modalDeleteClient = false;
      this.getClientes({});
    },
    filterClientes(event) {
      if (this.debounceTimer) {
        this.searchKeyword = event?.target?.value || "";
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        const keyword =
          this.searchKeyword != null && this.searchKeyword !== ""
            ? `%${this.searchKeyword}%`
            : null;
        this.getClientes({ keyword });
      }, 500);
    },
  },
};
</script>

<style scoped>
.filtros {
  box-shadow: 1px 0.5rem 0.8rem rgb(0 0 0 / 10%);
  padding: 0.5rem;
  display: flex;
  border-radius: 0 0 1rem 1rem;
}
div.filtros > div.d-inline-flex.auto-scroll.pb-2 {
  overflow-x: scroll;
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
.el-button.is-circle {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
}
div:deep(.el-pagination.is-background.el-pagination--small) {
  justify-content: center;
}
</style>
