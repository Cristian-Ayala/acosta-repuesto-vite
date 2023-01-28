<template>
  <div id="app">
    <!-- <InstallPrompt /> -->
    <!-- eslint-disable vue/v-on-event-hyphenation -->
    <header-comp @toggleSideBar="isLeftSideBar = !isLeftSideBar" ></header-comp>
    <div class="d-flex align-items-stretch">
      <transition name="fade"
      ><div
        v-if="isLeftSideBar"
        class="fondoNegro"
        @click="isLeftSideBar = false"
      ></div>
      </transition>
      <transition name="side-in">
        <left-side-bar v-if="isLeftSideBar" />
      </transition>
      <router-view :class="{ 'noscroll': isLeftSideBar }"/>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import HeaderComp from '@/components/Header.vue';
import LeftSideBar from '@/components/Left-SideBar.vue';
// import InstallPrompt from "@/components/InstallPrompt.vue";

export default {
  name: 'App',
  components: {
    HeaderComp,
    LeftSideBar,
    // InstallPrompt,
  },
  data() {
    return {
      isLeftSideBar: false,
    };
  },
  created() {
    // import { isLoggedIn } from './router/middleware/auth';
    this.initDB();
    this.initDbCategorias();
    this.initDbProductos();
    // // this.initDBUsuarios();
    this.initDbOrdenes();
  },
  methods: {
    ...mapActions('marcas', ['initDB']),
    ...mapActions('categorias', ['initDbCategorias']),
    ...mapActions('productos', ['initDbProductos']),
    // ...mapActions("usuarios", ["initDBUsuarios"]),
    ...mapActions('ordenes', ['initDbOrdenes']),
  },
};
</script>

<style scoped>
.fondoNegro {
  position: fixed;
  background: #00000059;
  height: 100%;
  width: 100%;
  z-index: 20;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.noscroll {
  overflow: hidden;
  position: fixed;
}
</style>