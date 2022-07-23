<template>
  <div>
    <modals-container ref="modal_name" />
    <b-modal
      id="modal-edit-user"
      centered
      title="¿Qué desea modificar?"
      hide-footer
      v-model="showModalEdit"
      @close="setModalEditShow(false)"
    >
      <div class="card-body d-flex justify-content-around">
        <div class="d-inline-block text-center">
          <h6>Usuario</h6>
          <b-button
            v-b-modal.modal-edit-name
            class="btn btn-outline-info btn-circle"
          >
            <i class="fas fa-signature" aria-hidden="true"></i>
          </b-button>
        </div>
        <div class="d-inline-block text-center">
          <h6>Contraseña</h6>
          <b-button
            v-b-modal.modal-edit-password
            class="btn btn-outline-info btn-circle"
          >
            <i class="fas fa-key" aria-hidden="true"></i>
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapMutations,mapState } from "vuex";

export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations("usuarios", ["setModalEditShow"]),
  },
  computed: {
      ...mapState("usuarios", ["showModalEdit"]),
  },
  mounted() {},
};
</script>
<style scoped>
.btn-circle {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
}
</style>