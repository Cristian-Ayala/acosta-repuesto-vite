<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Usuarios
            </h6>
            <b-button
              v-b-modal.modalNewUsuario
              variant="success"
              v-on:click="clearData()"
            >
              <i class="fa fa-plus" aria-hidden="true"></i>
            </b-button>
          </div>
          <div class="card-body">
            <table class="table card-text table-hover">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Operaciones</th>
                </tr>
              </thead>
              <tbody v-if="usuarios">
                <tr v-for="user in usuarios" :key="user.id">
                  <td>{{ user.id.substring(17) }}</td>
                  <td>
                    <b-button
                      v-b-modal.modal-delete-user
                      variant="danger"
                      v-on:click="setUser(user)"
                      class="btn btn-outline-danger btn-circle"
                    >
                      <i class="fas fa-times" aria-hidden="true"></i>
                    </b-button>
                    <b-button
                      variant="warning"
                      class="btn btn-outline-warning btn-circle"
                      v-on:click="setUser(user);setModalEditShow(true);"
                    >
                      <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                    </b-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <b-skeleton-table
              :rows="5"
              :columns="2"
              v-if="usuarios.length === 0"
            ></b-skeleton-table>
          </div>
        </div>
      </div>
    </div>
    <NewUsuario></NewUsuario>
    <EditUser></EditUser>
    <EditUserName></EditUserName>
    <EditUserPassword></EditUserPassword>
    <DeleteUser></DeleteUser>
  </div>
</template>
<script>
// import { mapState, mapMutations, mapActions } from "vuex";
import { mapMutations, mapState } from "vuex";
import NewUsuario from "@/components/Usuarios/NewUsuario.vue";
import EditUser from "@/components/Usuarios/EditUser.vue";
import EditUserName from "@/components/Usuarios/EditUserName.vue";
import EditUserPassword from "@/components/Usuarios/EditUserPassword.vue";
import DeleteUser from "@/components/Usuarios/DeleteUser.vue";

export default {
  name: "Usuarios",
  components: {
    NewUsuario,
    EditUser,
    EditUserName,
    EditUserPassword,
    DeleteUser
  },
  data: () => {
    return {};
  },
  computed: {
    ...mapState("usuarios", ["usuarios"]),
  },
  methods: {
    ...mapMutations("usuarios", ["clearData", "setUser","setModalEditShow"]),
  },
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