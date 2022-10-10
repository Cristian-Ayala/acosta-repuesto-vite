<template>
  <div>
    <!-- inicio del modal para eliminar (mobile) -->
    <b-modal id="addEditProdMovile" :title="title" centered @show="modalIsActive()" @hide="modalWillHide()">
      <div v-if="newProductMobile">
        <div class="form-group row">
          <label class="col-md-3 form-control-label">UPC:</label>
          <div class="col-md-9"></div>
          <div v-if="newProductMobile.doc" class="col-md-9 input-group">
            <input
              v-model="newProductMobile.doc.upc"
              type="text"
              class="form-control"
            ><span
              v-b-modal.barCode
              class="input-group-text"
              @click="
                showBarcode = !showBarcode;
                setCalledFrom('AddEditProdMovile.vue');
              "
            ><i class="fas fa-barcode"
            ></i></span>
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Nombre</label>
          <div v-if="newProductMobile.doc" class="col-md-9">
            <input
              v-model="newProductMobile.doc.nombreProd"
              type="text"
              class="form-control"
            >
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Foto:</label>
          <div v-if="newProductMobile.doc" class="col-md-9">
            <h6 v-if="error">{{ error }}</h6>
            <div v-if="loadingEffect" class="spinner-border" role="status">
              <span class="sr-only">Cargando...</span>
            </div>
            <input
              v-if="!imagePreview && !loadingEffect"
              id="uploadPictures"
              type="file"
              accept="image/x-png,image/jpeg,image/webp"
              style="color: transparent"
              @change="
                upload();
                loadingEffect = true;
                error = '';
              "
            >
            <div
              v-if="imagePreview && !loadingEffect"
              class="image-preview-container"
            >
              <img
                class="image-preview"
                :src="imagePreview"
                alt="Picture"
                width="150"
                height="100%"
              >
              <b-button variant="danger" @click="imagePreview = ''"
              >Quitar</b-button
              >
            </div>
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Marca</label>
          <div v-if="newProductMobile.doc" class="col-md-9">
            <b-dropdown
              :text="marcaDropdown"
              split
              lazy
              split-variant="outline-dark"
              variant="dark"
              class="m-2"
            >
              <b-dropdown-item
                v-for="marca in marcas"
                :key="marca.doc.nombreMarca"
                href="#"
                @click="marcaSel(marca.doc)"
              >{{ marca.doc.nombreMarca }}</b-dropdown-item
              >
              <b-button
                v-b-modal.modalAgregarMar
                variant="success"
                class="btn-circle"
                @click="clearData()"
              ><i class="fa fa-plus" aria-hidden="true"></i>
              </b-button>
            </b-dropdown>
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Categoria</label>
          <div v-if="newProductMobile.doc" class="col-md-9">
            <b-dropdown
              :text="descripcionDropdown"
              split
              lazy
              split-variant="outline-dark"
              variant="dark"
              class="m-2"
            >
              <b-dropdown-item
                v-for="categoria in categorias"
                :key="categoria.doc.nombreCategoria"
                href="#"
                @click="catSel(categoria.doc)"
              >{{ categoria.doc.nombreCategoria }}</b-dropdown-item
              >
              <b-button
                v-b-modal.modal-1
                variant="success"
                class="btn-circle"
                @click="clearDataCat()"
              ><i class="fa fa-plus" aria-hidden="true"></i>
              </b-button>
            </b-dropdown>
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Precio Mayorista:</label>
          <div v-if="newProductMobile.doc" class="col-md-9">
            <input
              v-model="newProductMobile.doc.precioMayoreo"
              type="number"
              class="form-control"
              min="0"
            >
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <!-- ------------------------------------------ -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Precio Público:</label>
          <div v-if="newProductMobile.doc" class="col-md-9">
            <input
              v-model="newProductMobile.doc.precioPublico"
              type="number"
              class="form-control"
              min="0"
            >
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <!-- ------------------------------------------ -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Precio Taller:</label>
          <div v-if="newProductMobile.doc" class="col-md-9">
            <input
              v-model="newProductMobile.doc.precioTaller"
              type="number"
              class="form-control"
              min="0"
            >
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Stock:</label>
          <div v-if="newProductMobile.doc" class="col-md-9">
            <b-form-spinbutton
              id="decrementIncrement"
              v-model="newProductMobile.doc.stockProd"
              min="0"
              max="1000000"
            ></b-form-spinbutton>
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
      </div>
      <template #modal-footer="{ ok, cancel }">
        <b-button size="md" variant="danger" @click="cancel()">
          Cancelar
        </b-button>
        <b-button
          size="md"
          variant="success"
          @click="
            ok();
            confirmation(newProductMobile);
          "
        >
          Confirmar
        </b-button>
      </template>
    </b-modal>
    <!-- Fin del modal para eliminar (mobile) -->
    <agregar-mar></agregar-mar>
    <agregar-cat></agregar-cat>
    <u-p-c-reader></u-p-c-reader>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import { blobToURL, fromBlob } from 'image-resize-compress';
import AgregarMar from '@/components/Marcas/AgregarMar.vue';
import AgregarCat from '@/components/Categorias/AgregarCat.vue';
import UPCReader from '@/components/Productos/UPCReader.vue';

// Variables for upc barcode scanner
let code = '';
let reading = false;

export default {
  name: 'AddEditProdMovile',
  components: {
    AgregarMar,
    AgregarCat,
    UPCReader,
  },
  props: {
    title: {
      type: String,
      default: 'Editar',
      marcaDropdown: '',
      descripcionDropdown: '',
    },
  },
  data() {
    return {
      imagePreview: '',
      showBarcode: false,
      loadingEffect: false,
      error: '',
    };
  },
  computed: {
    ...mapState('productos', ['newProductMobile']),
    ...mapState('marcas', ['marcas']),
    ...mapState('categorias', ['categorias']),
  },
  watch: {
    newProductMobile: {
      // This will let Vue know to look inside the array
      handler() {
        if (this.newProductMobile.doc) {
          if (this.newProductMobile.doc.nombreCategoria) {
            this.descripcionDropdown =
              this.newProductMobile.doc.nombreCategoria;
          } else {
            this.descripcionDropdown = '';
          }
          if (this.newProductMobile.doc.nombreMarca) {
            this.marcaDropdown = this.newProductMobile.doc.nombreMarca;
          } else {
            this.marcaDropdown = '';
          }
          if (this.newProductMobile.doc.foto) {
            this.imagePreview = this.newProductMobile.doc.foto;
          } else {
            this.imagePreview = '';
          }
        }
      },
    },
    // barcode() {
    //   this.newProductMobile = this.barcode;
    // },
  },
  methods: {
    ...mapMutations('productos', [
      'removeRegistro',
      'applyAllChanges',
      'marcaSelected',
      'categoriaSelected',
      'fotoSelected',
      'setCalledFrom',
    ]),
    ...mapActions('productos', ['confirmation']),
    ...mapMutations('marcas', ['clearData']),
    ...mapMutations('categorias', ['clearDataCat']),
    upload() {
      return new Promise((resolve, reject) => {
        const filePicker = document.getElementById('uploadPictures');

        if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
          reject(new Error('No hay imagen seleccionada'));
          return;
        }
        const myFile = filePicker.files[0];

        // Options for file
        const quality = 100;
        const width = 'auto';
        const height = 'auto';
        const format = 'webp';
        this.checkSize(myFile, quality, width, height, format);
        // console.log(myFile);//prints the file in JSON
        resolve();
      });
    },
    checkSize(myFile, quality, width, height, format) {
      fromBlob(myFile, quality, width, height, format).then((blob) => {
        console.log(blob);
        if (blob.size > 400000) {
          if (quality > 20) this.checkSize(myFile, quality -20, width, height, format);
          else if (quality === 20) this.checkSize(myFile, 10, width, height, format);
          else if (quality === 10) this.checkSize(myFile, 1, width, height, format);
          else{
            this.error = 'La imagen es demasiado grande';
            this.loadingEffect = false;
          }
          return;
        }
        // will generate a url to the converted file
        blobToURL(blob).then((url) => {
          this.imagePreview = url;
          this.fotoSelected(url);
          this.loadingEffect = false;
          // console.log(`KB length: ${  blob.size}`) / 1e3;
          // console.log(`MB: ${  blob.size / 1e6}`);
        });
      });
    },
    marcaSel(marca) {
      Vue.set(this, 'marcaDropdown', marca.nombreMarca);
      this.marcaSelected(marca.nombreMarca);
    },
    catSel(categoria) {
      Vue.set(this, 'descripcionDropdown', categoria.nombreCategoria);
      this.categoriaSelected(categoria.nombreCategoria);
    },
    modalIsActive() {
      document.addEventListener('keypress', this.listenerFunction);
    },
    modalWillHide() {
      document.removeEventListener('keypress', this.listenerFunction);
    },
    listenerFunction(e) {
      // usually scanners throw an 'Enter' key at the end of read
      if (e.key === 'Enter') {
        if (code.length > 10) {
          this.newProductMobile.doc.upc = code;
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
@media (max-width) {
  :deep(.btn-group > .btn-group:not(:first-child) > .btn),
  .btn-group > .btn:not(:first-child) {
    color: #ffffff;
    min-width: 0px;
    background-color: #343a40;
    border-color: #343a40;
    margin: 0;
    padding: 3rem !important;
  }
}
.btn-circle {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
}
:deep(.dropdown-menu.show) {
  text-align: center;
}
:deep(.b-form-spinbutton button) {
  color: black !important;
}

.input-group-text {
  border-radius: 0 1rem 1rem 0;
  width: 4rem;
  justify-content: center;
}
/* .dropdown .btn-group{
display: inline-flex;
} */
.dropdown-toggle::after {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 0.255em;
  vertical-align: 0.255em;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}
:deep(div.dropdown button.dropdown-toggle) {
  color: #ffffff;
  min-width: auto;
  padding: 0.4rem 1.8rem;
  text-transform: none;
  font-weight: 300;
  margin-bottom: 0;
  background-image: none;
  background-size: 0 2px, 100% 1px;
  background-repeat: no-repeat;
  background-position: bottom, 50% calc(100% - 1px);
  background-color: #343a40;
  transition: background 0s ease-out;
  float: none;
  box-shadow: none;
  border-radius: 0 1rem 1rem 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 100%;
}

:deep(div.dropdown.b-dropdown.m-2.btn-group) {
  display: inline-flex;
}
.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: spinner-border 0.75s linear infinite;
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>

