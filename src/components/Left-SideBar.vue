<template>
  <div id="sidebar" class="sidebar shrink">
    <div
      class="text-gray-400 text-uppercase px-3 px-lg-4 py-4 font-weight-bold small headings-font-family"
    >
      MENÚ
    </div>
    <ul class="sidebar-menu list-unstyled">
      <router-link
        v-slot="{ href, navigate, isExactActive }"
        to="/"
        custom
      >
        <a
          :href="href" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive }"
          @click="navigate()">
          <i class="fas fa-home mr-4 text-gray my-2"></i><span>Home</span>
        </a>
      </router-link>
      <router-link
        v-slot="{ href, navigate, isExactActive }"
        to="/categorias"
        custom
      >
        <a
          :href="href" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive }"
          @click="navigate()">
          <i class="fa fa-list-alt mr-4 text-gray my-2"></i
          ><span>Categorias</span>
        </a>
      </router-link>
      <router-link
        v-slot="{ href, navigate, isExactActive }"
        to="/marcas"
        custom
      >
        <a
          :href="href" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive }"
          @click="navigate()">
          <i class="fas fa-list-ul mr-4 text-gray my-2"></i>
          <span>Marca</span>
        </a>
      </router-link>
      <router-link
        v-slot="{ href, navigate, isExactActive }"
        to="/productos"
        custom
      >
        <a
          :href="href" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive }"
          @click="navigate()">
          <i class="fas fa-boxes mr-3 text-gray my-2"></i><span>Productos</span>
        </a>
      </router-link>
      <router-link
        v-slot="{ href, navigate, isExactActive }"
        to="/ordenes"
        custom
      >
        <a
          :href="href" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive }"
          @click="navigate()">
          <i class="fas fa-clipboard-check mr-3 text-gray my-2"></i
          ><span>Ordenes</span>
        </a>
      </router-link>
      <router-link
        v-slot="{ href, navigate, isExactActive }"
        to="/estadisticas"
        custom
      >
        <a
          :href="href" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive }"
          @click="navigate()">
          <i class="fas fa-chart-bar text-gray my-2" aria-hidden="true"></i>
          <span>Estadísticas</span>
        </a>
      </router-link>
      <router-link
        v-if="actualUser.roles && actualUser.roles.length"
        v-slot="{ href, navigate, isExactActive }"
        to="/usuarios"
        custom
      >
        <a
          :href="href" class="sidebar-link text-muted sidebar-list-item" :class="{ 'active': isExactActive }"
          @click="navigate()">
          <i class="fa fa-user mr-3 text-gray my-2" aria-hidden="true"></i>
          <span>Usuarios</span>
        </a>
      </router-link>
    </ul>
    <a
      href="#"
      class="sidebar-link text-muted sidebar-list-item position-bottom logout"
      @click="logout()"
    >
      <i class="fas fa-door-open mr-3 text-black my-2" aria-hidden="true"></i>
      <span v-if="actualUser">Salir <br>{{ userName }}</span>
    </a>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "LeftSideBar",
  computed: {
    ...mapState("usuarios", ["actualUser"]),
    userName() {
      const username = window.localStorage.getItem("user_name");
      return username || null;
    },
  },
  methods: {
    ...mapActions("usuarios", ["logout"]),
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
