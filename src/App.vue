<template>
  <div id="app">
    <!-- <InstallPrompt /> -->
    <Header @toggleSideBar="isLeftSideBar = !isLeftSideBar" />
    <div class="d-flex align-items-stretch">
      <transition name="fade"
        ><div
          class="fondoNegro"
          v-if="isLeftSideBar"
          @click="isLeftSideBar = false"
        ></div>
      </transition>
      <transition name="side-in">
        <LeftSideBar v-if="isLeftSideBar" />
      </transition>
      <router-view v-bind:class="{'noscroll':isLeftSideBar}"/>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import LeftSideBar from "@/components/Left-SideBar.vue";
// import InstallPrompt from "@/components/InstallPrompt.vue";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Header,
    LeftSideBar,
    // InstallPrompt,
  },
  data() {
    return {
      isLeftSideBar: false,
    };
  },
  methods: {
    ...mapActions("marcas", ["initDB"]),
    ...mapActions("categorias", ["initDbCategorias"]),
    ...mapActions("productos", ["initDbProductos"]),
    // ...mapActions("usuarios", ["initDBUsuarios"]),
    // ...mapActions("ordenes", ["initDbOrdenes"]),
  },
  created() {
    this.initDB();
    this.initDbCategorias();
    this.initDbProductos();
    // // this.initDBUsuarios();
    // this.initDbOrdenes();
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