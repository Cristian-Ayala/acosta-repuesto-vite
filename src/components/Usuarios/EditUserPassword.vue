<template>
  <div>
    <b-modal
      id="modal-edit-password"
      centered
      title="Editar contraseña de usuario"
    >
      <div class="card-body">
        <div class="form-group row">
          <label class="col-md-3 form-control-label">Nueva contraseña</label>
          <div class="col-md-9">
            <input
              v-if="usuario"
              v-model="usuario.password"
              type="text"
              class="form-control"
            >
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
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'EditUserPassword',
  data() {
    return {};
  },
  computed: {
    ...mapState('usuarios', ['usuario']),
  },
  mounted() {},
  methods: {
    ...mapMutations('usuarios', ['setModalEditShow']),
    ...mapActions('usuarios', ['editRegistro']),
  },
};
</script>