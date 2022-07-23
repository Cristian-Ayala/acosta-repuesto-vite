<template>
  <div>
    <b-modal id="modalNewUsuario" centered title="Agregar usuario">
      <div class="card-body">
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Usuario</label>
          <div class="col-md-9">
            <input
              type="text"
              class="form-control"
              v-model="usuario.nickname"
            />
          </div>
        </div>
        <div class="line"></div>
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Contraseña</label>
          <div class="col-md-9">
            <input
              type="text"
              class="form-control"
              v-model="usuario.password"
            />
          </div>
        </div>
      </div>

      <template #modal-footer="{ cancel, ok }">
        <b-button size="m" variant="secondary" @click="cancel()">
          Cancelar
        </b-button>
        <b-button
          size="m"
          variant="primary"
          @click="
            ok();
            createRegistro();
          "
        >
          Guardar
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "newUser",
  data() {
    return {};
  },
  methods: {
    ...mapActions("usuarios", ["createRegistro"]),
  },
  computed: {
    ...mapState("usuarios", ["usuario"]),
  },
};
</script>
