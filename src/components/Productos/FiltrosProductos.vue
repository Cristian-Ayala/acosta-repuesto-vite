<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="mostrar.modalFiltros"
    title="Eliminar Producto"
    destroy-on-close
    width="90%"
    :before-close="clearFilters()"
    top="5vh"
  >
    <h5>UPC</h5>
    <div class="input-group">
      <!-- v-b-modal.barCode -->
      <input v-model="tmpFiltroUPC" type="text" class="form-control" ><span
        class="input-group-text"
        @click="
          showBarcode = !showBarcode;
          setCalledFrom('FiltrosProductos.vue');
        "
      ><i class="fas fa-barcode"
      ></i></span>
    </div>
    <hr >
    <div class="nombreProducto">
      <h5>Nombre</h5>
      <input v-model="tmpFiltroNombre" type="search" placeholder="Buscar" >
    </div>
    <hr >
    <div v-if="marcas.length > 0" class="marcas">
      <h5>Marcas:</h5>
      <el-checkbox-group v-model="tmpFiltroMarcasActivas">
        <el-checkbox v-for="mar in marcas" :key="mar.doc.nombreMarca" :label="mar.doc.nombreMarca" border/>
      </el-checkbox-group>
    </div>
    <hr >
    <div v-if="categorias.length > 0" class="categorias">
      <h5>Categorias:</h5>
      <el-checkbox-group v-model="tmpFiltroCategoriasActivas">
        <el-checkbox
          v-for="categoria in categorias"
          :key="categoria.doc.nombreCategoria"
          :label="categoria.doc.nombreCategoria"
          border
        />
      </el-checkbox-group>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="borrarFiltros();mostrar.modalFiltros = false;">Borrar Filtros</el-button>
        <el-button
          type="primary"
          @click="aplicarFiltros({
                    cat: tmpFiltroCategoriasActivas,
                    mar: tmpFiltroMarcasActivas,
                    upc: tmpFiltroUPC,
                    nom: tmpFiltroNombre,
                  });
                  mostrar.modalFiltros = false;"
        >
          Aplicar Filtros
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

// Variables for upc barcode scanner
let code = '';
let reading = false;

export default {
  name: 'FiltrosProductos',
  props: {
    mostrar: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
      tmpFiltroMarcasActivas: [],
      tmpFiltroCategoriasActivas: [],
      tmpFiltroNombre: '',
      tmpFiltroUPC: '',
      showBarcode: false,
    }),
  computed: {
    ...mapState('categorias', ['categorias']),
    ...mapState('marcas', ['marcas']),
    ...mapState('productos', [
      'filtroCategorias',
      'filtroMarcas',
      'filtroNombre',
      'filtroUPC',
      'tempFiltroUPC'
    ]),
  },
  watch: {
    filtroMarcas (filtroMarcas) {
      this.tmpFiltroMarcasActivas = [...filtroMarcas];
    },
    filtroCategorias (filtroCategorias) {
      this.tmpFiltroCategoriasActivas = [...filtroCategorias];
    },
    filtroNombre (filtroNombre) {
      this.tmpFiltroNombre = filtroNombre.toString();
    },
    filtroUPC (filtroUPC) {
      // this.setFiltroUPC(filtroUPC.toString());
      this.tmpFiltroUPC = filtroUPC;
    },
    tempFiltroUPC (tempFiltroUPC) {
      this.tmpFiltroUPC = tempFiltroUPC;
    },
  },
  mounted () {
    this.getFilters()
  },
  methods: {
    ...mapActions('productos', ['aplicarFiltros', 'borrarFiltros']),
    ...mapMutations('productos', ['setCalledFrom','setFiltroUPC']),
    getFilters() {
      // console.log(JSON.parse(JSON.stringify(this.filtroMarcas)));
      // console.log(this.filtroMarcas);
      // console.log(JSON.parse(JSON.stringify(this.filtroMarcas)) == this.filtroMarcas);
      // console.log([...this.filtroMarcas]);
      // this.tmpFiltroMarcasActivas = JSON.parse(JSON.stringify(this.filtroMarcas));
      this.tmpFiltroMarcasActivas = [...this.filtroMarcas];
      this.tmpFiltroCategoriasActivas = [...this.filtroCategorias];
      this.tmpFiltroNombre = this.filtroNombre.toString();
      this.tmpFiltroUPC = this.filtroUPC.toString();
      document.addEventListener('keypress', this.listenerFunction);
    },
    clearFilters() {
      document.removeEventListener('keypress', this.listenerFunction);
    },
    listenerFunction(e) {
      // usually scanners throw an 'Enter' key at the end of read
      if (e.key === 'Enter') {
        if (code.length > 10) {
          this.tmpFiltroUPC = code;
          this.aplicarFiltros({
              cat: [],
              mar: [],
              upc: this.tmpFiltroUPC,
              nom: '',
            });
          this.$bvModal.hide('modalFiltros');
          /// code ready to use
          code = '';
        }
      } else {
        code += e.key; // while this is not an 'enter' it stores the every key
      }
      // run a timeout of 200ms at the first read and clear everything
      if (!reading) {
        reading = true;
        setTimeout(() => {
          code = '';
          reading = false;
        }, 200); // 200 works fine for me but you can adjust it
      }
    },
  },
};
</script>

<style scoped>
:deep(#modalFiltros div.modal-content) {
  min-height: 100%;
}
:deep(#modalFiltros div.modal-dialog.modal-xl) {
  padding: 0%;
  margin: 0%;
  height: 100%;
}
:deep(#modalFiltros div.modal-body) {
  overflow-y: scroll;
}

/* search input */
input {
  outline: none;
}
input[type="search"] {
  margin-bottom: 1rem;
  -webkit-appearance: textfield;
  appearance: textfield;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  font-family: inherit;
  font-size: 100%;
}
input::-webkit-search-decoration,
input::-webkit-search-cancel-button {
  display: none;
}

input[type="search"] {
  background: #ededed
    url(https://static.tumblr.com/ftv85bp/MIXmud4tx/search-icon.png) no-repeat
    9px center;
  border: solid 1px #ccc;
  padding: 9px 10px 9px 32px;
  width: 55%;

  -webkit-border-radius: 10em;
  -moz-border-radius: 10em;
  border-radius: 10em;

  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
}
input[type="search"]:focus {
  width: 85%;
  background-color: #fff;
  border-color: #17a2b8;
  -webkit-box-shadow: 0 0 5px rgba(109, 207, 246, 0.5);
  -moz-box-shadow: 0 0 5px rgba(109, 207, 246, 0.5);
  box-shadow: 0 0 5px rgba(109, 207, 246, 0.5);
}

input:-moz-placeholder {
  color: #999;
}
input::-webkit-input-placeholder {
  color: #999;
}
/* fin del search input */
:deep(.btn-outline-info:hover) {
  color: #17a2b8;
  background-color: transparent;
  background-image: none;
  border-color: #17a2b8;
}
:deep(.input-group-text) {
  border-radius: 0 2rem 2rem 0;
}
</style>