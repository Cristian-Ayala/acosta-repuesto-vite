<template>
  <div>
    <b-modal id="modal-edit-name" centered title="Editar nombre de usuario">
      <div class="card-body">
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Usuario</label>
          <div class="col-md-9">
            <input
              v-if="usuario"
              type="text"
              class="form-control"
              v-model="usuario.nombre"
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
            editRegistro();
            ok();
            setModalEditShow(false);
          "
        >
          Guardar
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "EditUserName",
  data() {
    return {};
  },
  methods: {
    ...mapMutations("usuarios", ["setModalEditShow"]),
    ...mapActions("usuarios", ["editRegistro"]),
  },
  computed: {
    ...mapState("usuarios", ["usuario"]),
  },
  mounted() {},
};
</script>