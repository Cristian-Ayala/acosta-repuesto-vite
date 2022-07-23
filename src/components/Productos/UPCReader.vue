<template>
  <div>
    <b-modal id="barCode" title="Escanear Código de Barras" centered>
      <StreamBarcodeReader
        @decode="(a) => onDecode(a)"
        @loaded="() => onLoaded()"
        v-if="!barcode"
      ></StreamBarcodeReader>
      <span v-if="barcode"
        >¿Es este el UPC: <b>{{ barcode }}</b
        >?</span
      >
      <template #modal-footer="{ ok, hide }">
        <div v-if="barcode">
          <b-button size="md" variant="danger" @click="barcode = ''">
            Escanear de nuevo
          </b-button>
          <b-button size="md" variant="success" @click="ok()"> Si </b-button>
        </div>
        <div v-if="!barcode">
          <b-button
            size="sm"
            variant="outline-secondary"
            @click="hide('forget')"
          >
            Cerrar
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import StreamBarcodeReader from "@/components/StreamBarcodeReader.vue";
export default {
  name: "UPCReader",
  components: {
    StreamBarcodeReader,
  },
  data() {
    return {
      showBarcode: false,
      barcode: "",
    };
  },
  methods: {
    ...mapMutations("productos", ["setFiltroUPC"]),
    onDecode(a) {
      console.log(this.calledFrom);
      if (this.calledFrom === "FiltrosProductos.vue") {
        this.setFiltroUPC(a);
      }
      if (this.calledFrom === "AddEditProdMovile.vue") {
        this.newProductMobile.doc.upc = a;
      }
      this.barcode = a;
    },
    onLoaded() {
      console.log("cargado");
    },
  },
  computed: {
    ...mapState("productos", ["newProductMobile", "calledFrom"]),
  },
  watch: {
    calledFrom() {
      this.barcode = "";
    },
  },
};
</script>
