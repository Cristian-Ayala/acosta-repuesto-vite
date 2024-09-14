<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Usuarios
            </h6>
            <el-button color="#28a745" circle @click="manageUser(null)">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </el-button>
          </div>
          <div class="card-body">
            <div class="form-group position-relative mb-0 flex-middle">
              <i class="fas fa-search text-gray"></i>
              <input
                :value="searchDisplay"
                type="search"
                placeholder="Buscar usuario..."
                class="form-control form-control-sm border-0 no-shadow pl-4"
                @input="
                  (event) =>
                    (searchDisplay = event?.target?.value?.trim() || '')
                "
              />
            </div>
            <el-skeleton v-if="usersDropDown == null" :rows="4" animated />
            <table v-else class="table card-text table-hover">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Operaciones</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(usr, index) in usersDropDown"
                  v-show="filtro(index)"
                  :key="index"
                  :class="{ disabledRow: !usr?.active }"
                >
                  <td style="max-width: 40vw">
                    {{ usr.email }}
                  </td>
                  <td style="display: flex">
                    <!-- <el-button type="danger" circle @click="manageUser(usr)">
                      <i class="fas fa-times" aria-hidden="true"></i>
                    </el-button> -->
                    <el-button type="primary" circle @click="changePwd(usr)">
                      <i class="fas fa-user-lock"></i>
                    </el-button>
                    <el-button type="warning" circle @click="manageUser(usr)">
                      <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <manage-users
      v-if="showModalManageUsers"
      :show-modal="showModalManageUsers"
      :user-profile="userProfile"
      :usr-selected="usrSelected"
      @close="closeModalManageUsers()"
    ></manage-users>
    <change-password
      v-if="showModalToChangePassword"
      :show-modal="showModalToChangePassword"
      :usr-selected="usrSelected"
      @close-change-password="() => (showModalToChangePassword = false)"
    ></change-password>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const ManageUsers = defineAsyncComponent(
  () => import("@/components/ManageUsers.vue"),
);

const router = useRouter();
const store = useStore();
const userProfile = computed(() => store.state.auth.userProfile);
const showModalManageUsers = ref(false);
const usersDropDown = ref(null);
const searchDisplay = ref("");
const usrSelected = ref(null);
const showModalToChangePassword = ref(false);

const getUsers = async () => {
  usersDropDown.value = await store.dispatch("users/GET_USERS");
};

onMounted(async () => {
  if (
    userProfile.value == null ||
    !(
      userProfile.value.roles.includes("admin") ||
      userProfile.value.roles.includes("gerente_area")
    )
  ) {
    router.push({ name: "Home" });
    return;
  }

  getUsers();
});

const setUsrSelected = (usr) => {
  usrSelected.value = usr;
};

const changePwd = (usr) => {
  setUsrSelected(usr);
  showModalToChangePassword.value = true;
};

const manageUser = (usr) => {
  setUsrSelected(usr);
  showModalManageUsers.value = true;
};

const closeModalManageUsers = () => {
  showModalManageUsers.value = false;
  getUsers();
};

const filtro = (index) => {
  if (searchDisplay.value === "") return true;
  const userSearch = usersDropDown.value[index].email.toUpperCase();
  return userSearch.indexOf(searchDisplay.value.toUpperCase()) >= 0;
};
</script>

<style scoped>
.el-button.is-circle {
  width: 2rem;
  height: 2rem;
  padding: 0;
  font-size: 12px;
}
.disabledRow {
  background-color: #b9b9b9;
}
thead tr th {
  width: 50%;
}
tr {
  display: flex;
  border-radius: 1rem;
}
/* Mejor flex a la fila y ordenar así :B */
tr.disabledRow > td:first-child {
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

tr.disabledRow > td:last-child {
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
}
</style>
