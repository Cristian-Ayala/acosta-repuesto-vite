<template>
  <div>
    <!-- eslint-disable vue/no-mutating-props -->
    <!-- inicio del modal para eliminar (mobile) -->
    <el-dialog
      v-model="mostrar.addEditProdMovile"
      :title="title"
      width="90%"
      destroy-on-close
      :before-close="modalWillHide"
      top="5vh"
    >
      <div v-if="newProductMobile">
        <div
          class="form-group row"
          :class="{
            'has-error': v$.newProductMobile.upc.$invalid,
          }"
        >
          <label class="col-md-3 form-control-label">UPC:</label>
          <div class="col-md-9"></div>
          <div v-if="newProductMobile" class="col-md-9 input-group">
            <input
              v-model="newProductMobile.upc"
              type="text"
              class="form-control"
            />
            <span class="input-group-text" @click="show.modalUPCBarcode = true">
              <i class="fas fa-barcode"></i>
            </span>
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div
          class="form-group row"
          :class="{
            'has-error': v$.newProductMobile.nombre_producto.$invalid,
          }"
        >
          <label class="col-md-3 form-control-label">Nombre</label>
          <div class="col-md-9">
            <input
              v-model.trim="newProductMobile.nombre_producto"
              type="text"
              class="form-control"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <!-- TODO: sustituir por componente de element plus -->
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Foto:</label>
          <div class="col-md-9">
            <upload-image
              key="addEditProdMovileUploadPhoto"
              v-model="fotoArray"
              @new-picture-flag="newPictureFlag"
            ></upload-image>
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div
          class="form-group row"
          :class="{
            'has-error': v$.newProductMobile.id_marca.$invalid,
          }"
        >
          <label class="col-md-3 form-control-label">Marca</label>
          <div class="col-md-9">
            <el-select
              v-model="newProductMobile.id_marca"
              placeholder="Seleccione una marca"
              filterable
              :loading="loading.marcas"
              @input="brandSearch"
            >
              <el-option
                v-for="mar in marcas"
                :key="mar.id"
                :label="mar.nombre_marca"
                :value="mar.id"
              />
              <el-option label="" value="" disabled>
                <span style="display: flex; place-content: center">
                  <el-button
                    type="success"
                    circle
                    @click="show.modalAgregarMar = true"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-button>
                </span>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div
          class="form-group row"
          :class="{
            'has-error': v$.newProductMobile.id_categoria.$invalid,
          }"
        >
          <label class="col-md-3 form-control-label">Categoria</label>
          <div class="col-md-9">
            <el-select
              v-model="newProductMobile.id_categoria"
              class="m-2"
              placeholder="Seleccione una categoria"
              filterable
              :loading="loading.categorias"
              @input="categorySearch"
            >
              <el-option
                v-for="categoria in categorias"
                :key="categoria.id"
                :label="categoria.nombre_categoria"
                :value="categoria.id"
              />
              <el-option label="" value="" disabled>
                <span style="display: flex; place-content: center">
                  <el-button
                    type="success"
                    circle
                    @click="show.modalAgregarCat = true"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-button>
                </span>
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div
          class="form-group row"
          :class="{
            'has-error': v$.newProductMobile.precio_mayoreo.$invalid,
          }"
        >
          <label class="col-md-3 form-control-label">Precio Mayorista:</label>
          <div class="col-md-9">
            <el-input-number
              v-model="newProductMobile.precio_mayoreo"
              :precision="2"
              :min="0"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <!-- ------------------------------------------ -->
        <div
          class="form-group row"
          :class="{
            'has-error': v$.newProductMobile.precio_publico.$invalid,
          }"
        >
          <label class="col-md-3 form-control-label">Precio Público:</label>
          <div class="col-md-9">
            <el-input-number
              v-model="newProductMobile.precio_publico"
              :precision="2"
              :min="0"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <!-- ------------------------------------------ -->
        <div
          class="form-group row"
          :class="{
            'has-error': v$.newProductMobile.precio_taller.$invalid,
          }"
        >
          <label class="col-md-3 form-control-label">Precio Taller:</label>
          <div class="col-md-9">
            <el-input-number
              v-model="newProductMobile.precio_taller"
              :precision="2"
              :min="0"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div
          v-if="organizationDivision.includes('Santa Ana')"
          class="form-group row"
          :class="{
            'has-error': v$.newProductMobile.stock_prod_sta_ana.$invalid,
          }"
        >
          <label class="col-md-3 form-control-label">Stock - Santa Ana:</label>
          <div class="col-md-9">
            <el-input-number
              id="decrementIncrement"
              v-model="newProductMobile.stock_prod_sta_ana"
              :precision="0"
              :min="0"
              :max="1000000"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
        <div
          v-if="organizationDivision.includes('Metapan')"
          class="form-group row"
          :class="{
            'has-error': v$.newProductMobile.stock_prod_metapan.$invalid,
          }"
        >
          <label class="col-md-3 form-control-label">Stock - Metapan:</label>
          <div class="col-md-9">
            <el-input-number
              id="decrementIncrement"
              v-model="newProductMobile.stock_prod_metapan"
              :precision="0"
              :min="0"
              :max="1000000"
            />
          </div>
        </div>
        <div class="line"></div>
        <!-- ------------------------------------------ -->
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="mostrar.addEditProdMovile = false">
            Cancelar
          </el-button>
          <el-button
            type="primary"
            :disabled="formHasErrors"
            @click="confirm()"
          >
            Confirmar
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- Fin del modal para eliminar (mobile) -->
    <agregar-mar
      :show="show"
      @set-marca-selected="setMarcaSelected"
    ></agregar-mar>
    <agregar-cat
      :show="show"
      @set-categoria-selected="setCategoriaSelected"
    ></agregar-cat>
    <u-p-c-reader
      :show="show"
      @set-upc-selected="setUpcSelected"
    ></u-p-c-reader>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, integer } from "@vuelidate/validators";
import { mapActions, mapState } from "vuex";
import AgregarMar from "@/components/Marcas/AgregarMar.vue";
import AgregarCat from "@/components/Categorias/AgregarCat.vue";
import UPCReader from "@/components/Productos/UPCReader.vue";
import UploadImage from "@/components/Productos/UploadImage.vue";

// Variables for upc barcode scanner
let code = "";
let reading = false;
const newProductMobile = Object.freeze({
  upc: "",
  nombre_producto: "",
  foto: "",
  id_marca: null,
  id_categoria: null,
  precio_mayoreo: null,
  precio_publico: null,
  precio_taller: null,
  stock_prod_sta_ana: null,
  stock_prod_metapan: null,
});

export default {
  name: "AddEditProdMovile",
  components: {
    AgregarMar,
    AgregarCat,
    UPCReader,
    UploadImage,
  },
  props: {
    title: {
      type: String,
      default: "Editar",
    },
    mostrar: {
      type: Object,
      default: () => ({}),
    },
    prodSelected: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["loadingProduct"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      showBarcode: false,
      error: "",
      show: {
        modalAgregarMar: false,
        modalAgregarCat: false,
        modalUPCBarcode: false,
      },
      organizationDivision: "",
      newProductMobile: { ...newProductMobile },
      loading: {
        marcas: false,
        categorias: false,
        fullscreen: false,
      },
      marcas: [],
      categorias: [],
      formHasErrors: false,
      fotoArray: [],
      debounceTimer: null,
    };
  },
  validations() {
    return {
      newProductMobile: {
        upc: { required, $autoDirty: true },
        nombre_producto: { required },
        id_marca: { required },
        id_categoria: { required },
        precio_mayoreo: { required, minLength: 0 },
        precio_publico: { required, minLength: 0 },
        precio_taller: { required, minLength: 0 },
        stock_prod_sta_ana: {
          conditionalReq: this.stockProdStaAna,
          minLength: 0,
          integer,
        },
        stock_prod_metapan: {
          conditionalReq: this.stockProdMetapan,
          minLength: 0,
          integer,
        },
      },
    };
  },
  computed: {
    ...mapState("auth", ["userProfile"]),
  },
  watch: {
    "v$.$errors": {
      handler(value) {
        if (!value || !Array.isArray(value)) {
          this.formHasErrors = true;
          return;
        }
        this.formHasErrors = value.length > 0;
      },
      deep: true,
    },
    prodSelected: {
      async handler(value) {
        if (!value) return;
        if (value.CLEAR) {
          this.newProductMobile = { ...newProductMobile };
          return;
        }
        this.$emit("loadingProduct", true);
        this.categorias = await this.$store.dispatch(
          "categorias/getCategoriasByID",
          {
            id: value.categoria?.id,
          },
        );
        this.marcas = await this.$store.dispatch("marcas/GET_MARCA_BY_ID", {
          id: value.marca?.id,
        });
        /* eslint-disable */
        value.id_categoria = value.categoria?.id;
        value.id_marca = value.marca?.id;
        value.foto = `${this.$FILE_MANAGER}photo/${value.foto}`;
        delete value.__typename;
        delete value.marca;
        delete value.categoria;
        this.fotoArray = [value.foto];
        /* eslint-enable */
        this.newProductMobile = value;
        this.$emit("loadingProduct", false);
      },
      immediate: true,
    },
  },
  async mounted() {
    this.organizationDivision = this.userProfile?.sucursal;
    this.modalIsActive();
    this.v$.$validate();
  },
  methods: {
    ...mapActions("productos", ["confirmation"]),
    /* eslint-disable vue/no-mutating-props */
    async confirm() {
      const loading = this.$loading({ fullscreen: true });
      if (this.newProductMobile.UPLOAD_NEW_PICTURE && this.fotoArray.length) {
        [this.newProductMobile.foto] = this.fotoArray;
      }
      const res = await this.confirmation(this.newProductMobile);
      if (!res) {
        loading.close();
        return;
      }
      this.mostrar.addEditProdMovile = false;
      loading.close();
    },
    modalIsActive() {
      document.addEventListener("keypress", this.listenerFunction);
    },
    modalWillHide(done) {
      document.removeEventListener("keypress", this.listenerFunction);
      done();
    },
    listenerFunction(e) {
      // usually scanners throw an 'Enter' key at the end of read
      if (e.key === "Enter") {
        if (code.length > 10) {
          this.newProductMobile.upc = code;
          // this.$refs.dewdew.cwrcv();
          /// code ready to use
          code = "";
        }
      } else {
        code += e.key; // while this is not an 'enter' it stores the every key
      }
      // run a timeout of 200ms at the first read and clear everything
      if (!reading) {
        reading = true;
        setTimeout(() => {
          code = "";
          reading = false;
        }, 200); // 200 works fine for me but you can adjust it
      }
    },
    async remoteMethodMarcas(marcaKeyWord) {
      if (!marcaKeyWord || marcaKeyWord.trim() === "") return;
      this.loading.marcas = true;
      this.marcas = await this.$store.dispatch("marcas/getAll", {
        nombreMarca: `%${marcaKeyWord}%`,
      });
      this.loading.marcas = false;
    },
    async remoteMethodCategorias(categoriaKeyWord) {
      if (!categoriaKeyWord || categoriaKeyWord.trim() === "") return;
      this.loading.categorias = true;
      this.categorias = await this.$store.dispatch(
        "categorias/getCategoriasByKeyword",
        {
          nombreCat: `%${categoriaKeyWord}%`,
        },
      );
      this.loading.categorias = false;
    },
    newPictureFlag() {
      /* eslint-disable-next-line */
      this.newProductMobile.UPLOAD_NEW_PICTURE = true;
    },
    setMarcaSelected(marca) {
      this.newProductMobile.id_marca = marca.id;
      this.marcas = [marca];
    },
    setCategoriaSelected(categoria) {
      this.newProductMobile.id_categoria = categoria.id;
      this.categorias = [categoria];
    },
    setUpcSelected(upc) {
      this.newProductMobile.upc = upc;
    },
    async brandSearch(event) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.remoteMethodMarcas(event.target.value);
      }, 500);
    },
    async categorySearch(event) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.remoteMethodCategorias(event.target.value);
      }, 500);
    },
    stockProdMetapan(param) {
      if (!this.organizationDivision.includes("Metapan")) return true;
      return param != null && param >= 0;
    },
    stockProdStaAna(param) {
      if (!this.organizationDivision.includes("Santa Ana")) return true;
      return (
        param != null &&
        param >= 0
      );
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
  background-size:
    0 2px,
    100% 1px;
  background-repeat: no-repeat;
  background-position:
    bottom,
    50% calc(100% - 1px);
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

.plusWrapper {
  display: flex;
  place-content: center;
  border-top: 1px solid #cfcfcf;
  padding: 0.5rem 0;
}
img.image-preview {
  height: 100%;
  margin-right: 2rem;
}
:deep(.el-input-number) {
  width: 100%;
}
:deep(div.el-input__wrapper) {
  border-radius: 1rem;
}
:deep(.el-input-number__decrease) {
  border-radius: 1rem 0 0 1rem;
}
:deep(.el-input-number__increase) {
  border-radius: 0 1rem 1rem 0;
}
.has-error > label {
  color: var(--el-color-error-dark-2);
}

.has-error > div > input {
  border: 1px solid var(--el-color-error-dark-2);
}
.has-error :deep(div.el-input__wrapper) {
  border: 1px solid var(--el-color-error-dark-2);
}
.has-error :deep(input::placeholder) {
  color: var(--el-color-error-dark-2);
}
</style>
