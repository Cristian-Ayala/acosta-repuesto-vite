import { useVuelidate } from "@vuelidate/core";
import { mapMutations, mapActions } from "vuex";
import { blobToURL, fromBlob } from "image-resize-compress";
import { newProductMobile, code, reading } from "./AddEditProdMovile.vue";

export default (await import('vue')).defineComponent({
name: "AddEditProdMovile",
components: {
AgregarMar,
AgregarCat,
UPCReader,
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
setup() {
return { v$: useVuelidate() };
},
data() {
return {
imagePreview: "",
showBarcode: false,
loadingEffect: false,
error: "",
show: {
modalAgregarMar: false,
modalAgregarCat: false,
modalUPCBarcode: false,
},
organizationDivision: "",
newProductMobile,
loading: {
marcas: false,
categorias: false,
},
marcas: [],
categorias: [],
formHasErrors: false,
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
stock_prod_sta_ana: { required, minLength: 0, integer },
stock_prod_metapan: { required, minLength: 0, integer },
},
};
},
computed: {},
watch: {
newProductMobile: {
// This will let Vue know to look inside the array
handler() {
if (this.newProductMobile.foto) {
this.imagePreview = this.newProductMobile.foto;
} else {
this.imagePreview = "";
}
},
},
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
this.newProductMobile = newProductMobile;
return;
}
this.categorias = await this.$store.dispatch(
"categorias/getCategoriasByID",
{
id: value.categoria?.id,
}
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
/* eslint-enable */
this.newProductMobile = value;
},
immediate: true,
},
},
async mounted() {
this.organizationDivision = localStorage.getItem("sucursales");
this.modalIsActive();
this.v$.$validate();
},
methods: {
...mapMutations("productos", [
"removeRegistro",
"applyAllChanges",
"marcaSelected",
"categoriaSelected",
"fotoSelected",
"setCalledFrom",
]),
...mapActions("productos", ["confirmation"]),
/* eslint-disable vue/no-mutating-props */
async confirm() {
const res = await this.confirmation(this.newProductMobile);
if (!res) return;
this.mostrar.addEditProdMovile = false;
},
/* eslint-enable vue/no-mutating-props */
upload() {
return new Promise((resolve, reject) => {
const filePicker = document.getElementById("uploadPictures");

if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
reject(new Error("No hay imagen seleccionada"));
return;
}
const myFile = filePicker.files[0];

// Options for file
const quality = 100;
const width = "auto";
const height = "auto";
const format = "webp";
this.checkSize(myFile, quality, width, height, format);
// console.log(myFile);//prints the file in JSON
resolve();
});
},
checkSize(myFile, quality, width, height, format) {
fromBlob(myFile, quality, width, height, format).then((blob) => {
if (blob.size > 400000) {
if (quality > 20)
this.checkSize(myFile, quality - 20, width, height, format);
else if (quality === 20)
this.checkSize(myFile, 10, width, height, format);
else if (quality === 10)
this.checkSize(myFile, 1, width, height, format);
else {
this.error = "La imagen es demasiado grande";
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
window.console.log("code", code);
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
}
);
this.loading.categorias = false;
},
},
});
