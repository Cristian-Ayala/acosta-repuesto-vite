<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <div class="container-fluid px-xl-5">
      <div style="margin-top: 2rem">
        <div class="card">
          <div class="card-header">
            <h6 class="text-uppercase mb-0" style="display: inline-block">
              Preferencias
            </h6>
          </div>
        </div>
        <div class="cuadros-home">
          <div class="cuadro1-home" @click="showModalToChangePassword = true">
            <img
              src="../assets/img/password.webp"
              alt="..."
              style="max-width: 100%"
            />
            <div
              class="font-weight-bold d-block"
              style="margin: 1rem; font-size: 2.5rem"
            >
              Contraseña
            </div>
            <div class="cuadros-text-home">
              Cambia la contraseña de tu usuario.
            </div>
          </div>
          <div
            v-if="userProfile != null && userProfile.sucursal?.length > 1"
            class="cuadro2-home"
            @click="showModalToChangeAreaSelected = true"
          >
            <img
              src="../assets/img/mapLocation.webp"
              alt="..."
              style="max-width: 100%"
            />
            <div
              class="font-weight-bold d-block"
              style="margin: 1rem; font-size: 2.5rem"
            >
              Cede
            </div>
            <div class="cuadros-text-home">
              Cambia la cede en la que te encuentras.
            </div>
          </div>
        </div>
        <div
          v-if="
            userProfile != null &&
            (userProfile.roles.includes('admin') ||
              userProfile.roles.includes('gerente_area'))
          "
          class="cuadros-home"
        >
          <div
            class="cuadro4-home"
            @click="$router.push({ name: 'UsersView' })"
          >
            <img
              src="../assets/img/users.webp"
              alt="..."
              style="max-width: 100%"
            />
            <div
              class="font-weight-bold d-block"
              style="margin: 1rem; font-size: 2.5rem"
            >
              Usuarios
            </div>
            <div class="cuadros-text-home">
              Crea nuevos usuarios, editarlos o darles de baja
            </div>
          </div>
        </div>
      </div>
    </div>
    <change-area-selected
      v-if="showModalToChangeAreaSelected"
      :show="showModalToChangeAreaSelected"
      @close-area-selection="() => (showModalToChangeAreaSelected = false)"
    ></change-area-selected>
    <change-password
      v-if="showModalToChangePassword"
      :show-modal="showModalToChangePassword"
      @close-change-password="() => (showModalToChangePassword = false)"
    ></change-password>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from "vue";
import { useStore } from "vuex";

const ChangeAreaSelected = defineAsyncComponent(() =>
  import("@/components/ChangeAreaSelected.vue"),
);

const ChangePassword = defineAsyncComponent(() =>
  import("@/components/ChangePassword.vue"),
);

const store = useStore();
const userProfile = computed(() => store.state.auth.userProfile);
const showModalToChangeAreaSelected = ref(false);
const showModalToChangePassword = ref(false);
</script>

<style scoped>
.card-header {
  border-radius: 1rem;
}
</style>
