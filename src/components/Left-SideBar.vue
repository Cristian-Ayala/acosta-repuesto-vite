<template>
  <div id="sidebar" class="sidebar shrink">
    <div
      class="text-gray-400 text-uppercase px-3 px-lg-4 py-4 font-weight-bold small headings-font-family"
    >
      MENÚ
    </div>
    <ul class="sidebar-menu list-unstyled">
      <router-link
        to="/"
        custom
        v-slot="{ href, navigate, isExactActive }"
      >
        <a :href="href" @click="navigate" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive}">
          <i class="fas fa-home mr-4 text-gray my-2"></i><span>Home</span>
        </a>
      </router-link>
      <router-link
        to="/categorias"
        custom
        v-slot="{ href, navigate, isExactActive }"
      >
        <a :href="href" @click="navigate" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive}">
          <i class="fa fa-list-alt mr-4 text-gray my-2"></i
          ><span>Categorias</span>
        </a>
      </router-link>
      <router-link
        to="/marcas"
        custom
        v-slot="{ href, navigate, isExactActive }"
      >
        <a :href="href" @click="navigate" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive}">
          <i class="fas fa-list-ul mr-4 text-gray my-2"></i>
          <span>Marca</span>
        </a>
      </router-link>
      <router-link
        to="/productos"
        custom
        v-slot="{ href, navigate, isExactActive }"
      >
        <a :href="href" @click="navigate" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive}">
          <i class="fas fa-boxes mr-3 text-gray my-2"></i><span>Productos</span>
        </a>
      </router-link>
      <router-link
        to="/ordenes"
        custom
        v-slot="{ href, navigate, isExactActive }"
      >
        <a :href="href" @click="navigate" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive}">
          <i class="fas fa-clipboard-check mr-3 text-gray my-2"></i
          ><span>Ordenes</span>
        </a>
      </router-link>
      <router-link
        to="/actualizar"
        custom
        v-slot="{ href, navigate, isExactActive }"
      >
        <a :href="href" @click="navigate" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive}">
          <i class="fa fa-upload mr-3 text-gray my-2" aria-hidden="true"></i>
          <span>Actualizar</span>
        </a>
      </router-link>
      <router-link
        to="/usuarios"
        custom
        v-slot="{ href, navigate, isExactActive }"
        v-if="actualUser.roles && actualUser.roles.length"
      >
        <a :href="href" @click="navigate" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive}">
          <i class="fa fa-user mr-3 text-gray my-2" aria-hidden="true"></i>
          <span>Usuarios</span>
        </a>
      </router-link>
    </ul>
    <a
      href="#"
      @click="logout()"
      class="sidebar-link text-muted sidebar-list-item position-bottom logout"
    >
      <i class="fas fa-door-open mr-3 text-black my-2" aria-hidden="true"></i>
      <span v-if="actualUser">Salir {{ actualUser.user }}</span>
    </a>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions('usuarios', ['logout']),
  },
  computed: {
    ...mapState('usuarios', ['actualUser']),
  },
};
</script>
<style scoped>
.side-in-enter-active {
  transition: all 0.3s ease-out;
}
.side-in-leave-active {
  transition: all 0.3s ease-in;
}
.side-in-enter,
.side-in-leave-to {
  margin-left: -5rem;
  opacity: 0;
}
.position-bottom {
  position: fixed;
  bottom: 0;
  margin-bottom: 1rem;
  width: inherit;
}
@media (max-height: 655px) {
  .sidebar {
    overflow-y: scroll;
    padding-bottom: 2rem !important;
  }
  .logout {
    position: static;
  }
}
</style>
