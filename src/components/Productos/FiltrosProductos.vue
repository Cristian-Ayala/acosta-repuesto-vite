<template>
  <div>
    <b-modal
      id="modalFiltros"
      scrollable
      centered
      size="xl"
      title=""
      @show="getFilters"
      @hide="clearFilters"
    >
      <h5>UPC</h5>
      <div class="input-group">
        <input type="text" class="form-control" v-model="tmpFiltroUPC" /><span
          class="input-group-text"
          v-b-modal.barCode
          @click="
            showBarcode = !showBarcode;
            setCalledFrom('FiltrosProductos.vue');
          "
          ><i class="fas fa-barcode"
        /></span>
      </div>
      <hr />
      <div class="nombreProducto">
        <h5>Nombre</h5>
        <input type="search" placeholder="Buscar" v-model="tmpFiltroNombre" />
      </div>
      <hr />
      <div class="marcas" v-if="marcas.length > 0">
        <h5>Marcas:</h5>
        <b-button
          class="btn-sm p-1 m-1"
          variant="outline-info"
          v-for="mar in marcas"
          :key="mar.doc.nombreMarca"
          :class="{
            active: tmpFiltroMarcasActivas.includes(mar.doc),
          }"
          @click="
            tmpFiltroMarcasActivas.includes(mar.doc)
              ? tmpFiltroMarcasActivas.splice(
                  tmpFiltroMarcasActivas.indexOf(mar.doc),
                  1
                )
              : tmpFiltroMarcasActivas.push(mar.doc)
          "
        >
          {{ mar.doc.nombreMarca }}
        </b-button>
      </div>
      <hr />
      <div class="categorias" v-if="categorias.length > 0">
        <h5>Categorias:</h5>
        <b-button
          class="btn-sm p-1 m-1"
          variant="outline-info"
          v-for="categoria in categorias"
          :key="categoria.doc.nombreCategoria"
          :class="{
            active: tmpFiltroCategoriasActivas.includes(categoria.doc),
          }"
          @click="
            tmpFiltroCategoriasActivas.includes(categoria.doc)
              ? tmpFiltroCategoriasActivas.splice(
                  tmpFiltroCategoriasActivas.indexOf(categoria.doc),
                  1
                )
              : tmpFiltroCategoriasActivas.push(categoria.doc)
          "
        >
          {{ categoria.doc.nombreCategoria }}
        </b-button>
      </div>

      <template #modal-footer="{ ok, cancel }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button
          size="sm"
          variant="outline-info"
          @click="
            cancel();
            borrarFiltros();
          "
        >
          Borrar Filtros
        </b-button>
        <b-button
          size="sm"
          variant="info"
          @click="
            ok();
            aplicarFiltros({
              cat: tmpFiltroCategoriasActivas,
              mar: tmpFiltroMarcasActivas,
              upc: tmpFiltroUPC,
              nom: tmpFiltroNombre,
            });
          "
        >
          Aplicar Filtros
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
// import { mapState, mapMutations, mapActions } from "vuex";
import { mapActions, mapMutations, mapState } from "vuex";

// Variables for upc barcode scanner
let code = "";
let reading = false;

export default {
  name: "FiltrosProductos",
  props: {
    show: {
      type: Object,
      default: () => ({
        modalFiltros: false,
      }),
    },
  },
  data: () => {
    return {
      tmpFiltroMarcasActivas: [],
      tmpFiltroCategoriasActivas: [],
      tmpFiltroNombre: "",
      tmpFiltroUPC: "",
      showBarcode: false,
    };
  },
  computed: {
    ...mapState("categorias", ["categorias"]),
    ...mapState("marcas", ["marcas"]),
    ...mapState("productos", [
      "filtroCategorias",
      "filtroMarcas",
      "filtroNombre",
      "filtroUPC",
      "tempFiltroUPC"
    ]),
  },
  methods: {
    ...mapActions("productos", ["aplicarFiltros", "borrarFiltros"]),
    ...mapMutations("productos", ["setCalledFrom","setFiltroUPC"]),
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
      //usually scanners throw an 'Enter' key at the end of read
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
          code = "";
        }
      } else {
        code += e.key; //while this is not an 'enter' it stores the every key
      }
      //run a timeout of 200ms at the first read and clear everything
      if (!reading) {
        reading = true;
        setTimeout(() => {
          code = "";
          reading = false;
        }, 200); //200 works fine for me but you can adjust it
      }
    },
  },
  watch: {
    filtroMarcas: function (filtroMarcas) {
      this.tmpFiltroMarcasActivas = [...filtroMarcas];
    },
    filtroCategorias: function (filtroCategorias) {
      this.tmpFiltroCategoriasActivas = [...filtroCategorias];
    },
    filtroNombre: function (filtroNombre) {
      this.tmpFiltroNombre = filtroNombre.toString();
    },
    filtroUPC: function (filtroUPC) {
      // this.setFiltroUPC(filtroUPC.toString());
      this.tmpFiltroUPC = filtroUPC;
    },
    tempFiltroUPC: function (tempFiltroUPC) {
      this.tmpFiltroUPC = tempFiltroUPC;
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