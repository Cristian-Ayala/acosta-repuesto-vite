<template>
  <div>
    <b-modal
      id="modal-delete-user"
      centered
      title="Eliminar usuario"
    >
      <div class="card-body">
        <p v-if="usuario.id">¿Está seguro que quiere eliminar el usuario "{{usuario.id.substring(17)}}"?</p>
      </div>

      <template #modal-footer="{ cancel, ok }">
        <b-button size="m" variant="secondary" @click="cancel()">
          Cancelar
        </b-button>
        <b-button
          size="m"
          variant="primary"
          @click="
            removeRegistro();
            ok();
            setModalEditShow(false);
          "
        >
          Eliminar
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "DeleteUser",
  data() {
    return {};
  },
  methods: {
    ...mapMutations("usuarios", ["setModalEditShow"]),
    ...mapActions("usuarios", ["removeRegistro"]),
  },
  computed: {
    ...mapState("usuarios", ["usuario"]),
  },
  mounted() {},
};
</script>