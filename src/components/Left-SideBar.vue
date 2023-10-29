<template>
  <div id="sidebar" class="sidebar shrink">
    <div class="wrapper-menu">
      <!-- <div
        class="text-gray-400 text-uppercase px-3 px-lg-4 py-4 font-weight-bold small headings-font-family"
      >
        MENÚ
      </div> -->
      <ul class="sidebar-menu list-unstyled">
        <router-link v-slot="{ href, navigate, isExactActive }" to="/" custom>
          <a
            :href="href"
            class="sidebar-link text-muted sidebar-list-item"
            :class="{ active: isExactActive }"
            @click.prevent="navigate()"
          >
            <i class="fas fa-home mr-4 text-gray my-2"></i><span>Home</span>
          </a>
        </router-link>
        <router-link
          v-slot="{ href, navigate, isExactActive }"
          to="/categorias"
          custom
        >
          <a
            :href="href"
            class="sidebar-link text-muted sidebar-list-item"
            :class="{ active: isExactActive }"
            @click.prevent="navigate()"
          >
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
            :href="href"
            class="sidebar-link text-muted sidebar-list-item"
            :class="{ active: isExactActive }"
            @click.prevent="navigate()"
          >
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
            :href="href"
            class="sidebar-link text-muted sidebar-list-item"
            :class="{ active: isExactActive }"
            @click.prevent="navigate()"
          >
            <i class="fas fa-boxes mr-3 text-gray my-2"></i
            ><span>Productos</span>
          </a>
        </router-link>
        <router-link
          v-slot="{ href, navigate, isExactActive }"
          to="/ordenes"
          custom
        >
          <a
            :href="href"
            class="sidebar-link text-muted sidebar-list-item"
            :class="{ active: isExactActive }"
            @click.prevent="navigate()"
          >
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
            :href="href"
            class="sidebar-link text-muted sidebar-list-item"
            :class="{ active: isExactActive }"
            @click.prevent="navigate()"
          >
            <i class="fas fa-chart-bar text-gray my-2" aria-hidden="true"></i>
            <span>Estadísticas</span>
          </a>
        </router-link>
        <router-link
          v-slot="{ href, navigate, isExactActive }"
          to="/clientes"
          custom
        >
          <a
            :href="href"
            class="sidebar-link text-muted sidebar-list-item"
            :class="{ active: isExactActive }"
            @click.prevent="navigate()"
          >
            <i class="fas fa-user-alt text-gray my-2" aria-hidden="true"></i>
            <span>Clientes</span>
          </a>
        </router-link>
      </ul>
      <el-avatar v-if="profilePicture" :size="30" :src="profilePicture" />
      <span class="username">{{ userName }}</span>
    </div>
    <a
      href="#"
      class="sidebar-link text-muted sidebar-list-item position-bottom logout"
      @click="logout()"
    >
      <i class="fas fa-door-open mr-3 text-black my-2" aria-hidden="true"></i>
      <span>Salir</span>
    </a>
  </div>
</template>

<script>
export default {
  name: "LeftSideBar",
  data() {
    return {
      profilePicture: localStorage.getItem("profilePicture") || null,
      userName: localStorage.getItem("userName") || null,
    };
  },
  computed: {},
  methods: {
    logout() {
      localStorage.clear();
      this.$auth0.logout({
        logoutParams: { returnTo: window.location.origin },
      });
    },
  },
};
</script>

<style scoped>
.position-bottom {
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
.username {
  max-height: 4rem;
  max-width: 6rem;
  overflow: hidden;
  display: inline-block;
  line-break: auto;
  padding: 0 1rem;
}
</style>
