<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <el-dialog
    v-model="show.modalUPCBarcode"
    title="Escanear Código de Barras"
    width="90%"
    destroy-on-close
  >
    <stream-barcode-reader
      v-if="!barcode"
      show-list-cameras
      show-torch-btn
      @decode="(a) => onDecode(a)"
      @loaded="() => onLoaded()"
    ></stream-barcode-reader>
    <span v-if="barcode">
      ¿Es este el UPC: <b>{{ barcode }}</b>?
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="barcode = ''">Escanear de nuevo</el-button>
        <el-button
          type="primary"
          @click="show.modalUPCBarcode = false;"
        >
          Si
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import StreamBarcodeReader from "@/components/StreamBarcodeReader.vue";

export default {
  name: "UPCReader",
  components: {
    StreamBarcodeReader,
  },
  props: {
    show: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      showBarcode: false,
      barcode: "",
    };
  },
  computed: {
    ...mapState("productos", ["newProductMobile", "calledFrom"]),
  },
  watch: {
    calledFrom() {
      this.barcode = "";
    },
  },
  methods: {
    ...mapMutations("productos", ["setFiltroUPC"]),
    onDecode(a) {
      console.log(this.calledFrom);
      if (this.calledFrom === "FiltrosProductos.vue") {
        this.setFiltroUPC(a);
      }
      if (this.calledFrom === "AddEditProdMovile.vue") {
        this.newProductMobile.upc = a;
      }
      this.barcode = a;
    },
    onLoaded() {
      console.log("cargado");
    },
  },
};
</script>
