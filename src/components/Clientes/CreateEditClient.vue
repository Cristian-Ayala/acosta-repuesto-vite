<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-dialog
    v-model="mostrar.modalAddEditClient"
    :title="title"
    width="90%"
    top="5vh"
  >
    <!-- ------------------------------------------ -->
    <div
      class="form-group row"
      :class="{
        'has-error': v$.createEditClient.name.$invalid,
      }"
    >
      <label class="col-md-3 form-control-label">Nombres</label>
      <div class="col-md-9">
        <input
          v-model.trim="createEditClient.name"
          type="text"
          class="form-control"
        />
      </div>
    </div>
    <div class="line"></div>
    <!-- ------------------------------------------ -->
    <div
      class="form-group row"
      :class="{
        'has-error': v$.createEditClient.last_name.$invalid,
      }"
    >
      <label class="col-md-3 form-control-label">Apellidos</label>
      <div class="col-md-9">
        <input
          v-model.trim="createEditClient.last_name"
          type="text"
          class="form-control"
        />
      </div>
    </div>
    <div class="line"></div>
    <!-- ------------------------------------------ -->
    <div
      class="form-group row"
      :class="{
        'has-error': v$.createEditClient.email.$invalid,
      }"
    >
      <label class="col-md-3 form-control-label">Correo</label>
      <div class="col-md-9">
        <input
          v-model.trim="createEditClient.email"
          type="text"
          class="form-control"
        />
      </div>
    </div>
    <div class="line"></div>
    <!-- ------------------------------------------ -->
    <div class="form-group row">
      <label class="col-md-3 form-control-label">Teléfono</label>
      <div class="col-md-9">
        <input
          v-model.trim="createEditClient.telefono"
          type="text"
          class="form-control"
        />
      </div>
    </div>
    <div class="line"></div>
    <!-- ------------------------------------------ -->
    <div class="form-group row">
      <label class="col-md-3 form-control-label">Dirección</label>
      <div class="col-md-9">
        <input
          v-model.trim="createEditClient.direccion"
          type="text"
          class="form-control"
        />
      </div>
    </div>
    <div class="line"></div>
    <!-- ------------------------------------------ -->
    <div class="form-group row">
      <label class="col-md-3 form-control-label">Empresa</label>
      <div class="col-md-9">
        <input
          v-model.trim="createEditClient.empresa"
          type="text"
          class="form-control"
        />
      </div>
    </div>
    <div class="line"></div>
    <!-- ------------------------------------------ -->
    <div
      class="form-group row"
      :class="{
        'has-error': v$.createEditClient.dui.$invalid,
      }"
    >
      <label class="col-md-3 form-control-label">DUI</label>
      <div class="col-md-9">
        <input
          v-model.trim="createEditClient.dui"
          type="text"
          class="form-control"
        />
      </div>
    </div>
    <div class="line"></div>
    <!-- ------------------------------------------ -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="mostrar.modalAddEditClient = false">
          Cancelar
        </el-button>
        <el-button type="primary" :disabled="formHasErrors" @click="confirm()">
          Confirmar
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
/* eslint-disable vue/no-mutating-props */
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

const regexDUI = /^\d{8}-\d$/;
const validateDUI = (value) => regexDUI.test(value);

const createEditClientRef = Object.freeze({
  name: "",
  last_name: "",
  email: "",
  telefono: "",
  direccion: "",
  empresa: "",
  dui: "",
});

export default {
  name: "CreateEditClient",
  components: {},
  props: {
    title: {
      type: String,
      default: "Editar",
    },
    mostrar: {
      type: Object,
      default: () => ({}),
    },
    clientSelected: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["closeModalAndRefresh"],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      createEditClient: { ...createEditClientRef },
      formHasErrors: false,
    };
  },
  validations() {
    return {
      createEditClient: {
        name: { required },
        last_name: { required },
        email: { required, email },
        dui: { required, validateDUI },
      },
    };
  },
  computed: {},
  watch: {
    clientSelected: {
      handler(value) {
        if (!value) return;
        if (value.CLEAR) {
          this.createEditClient = { ...createEditClientRef };
          return;
        }
        this.createEditClient = { ...value };
        delete this.createEditClient.__typename;
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
  },
  async mounted() {
    this.v$.$validate();
  },
  methods: {
    async confirm() {
      const hasDupEmailOrDui = await this.$store.dispatch(
        "clientes/clientHasDupDuiOrEmail",
        {
          dui: this.createEditClient.dui,
          email: this.createEditClient.email,
          id: this.createEditClient.id,
        },
      );
      if (hasDupEmailOrDui) return;
      const client = await this.$store.dispatch(
        "clientes/createUpdateCliente",
        { client: this.createEditClient },
      );
      if (!client) return;
      this.$emit("closeModalAndRefresh", client);
    },
  },
};
</script>

<style scoped>
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
