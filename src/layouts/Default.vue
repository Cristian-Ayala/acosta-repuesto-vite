<template>
  <div id="app">
    <loading-screen v-if="loading.token"></loading-screen>
    <!-- <InstallPrompt /> -->
    <reload-p-w-a />
    <!-- eslint-disable vue/v-on-event-hyphenation -->
    <header-comp
      :is-left-side-bar-active="isLeftSideBar"
      @toggleSideBar="isLeftSideBar = !isLeftSideBar"
    ></header-comp>
    <div class="d-flex align-items-stretch">
      <transition name="fade">
        <div
          v-if="isLeftSideBar"
          class="fondoNegro"
          @click="isLeftSideBar = false"
        ></div>
      </transition>
      <transition name="slide-fade">
        <left-side-bar v-if="isLeftSideBar" />
      </transition>
      <router-view v-slot="{ Component }" :class="{ noscroll: isLeftSideBar }">
        <transition name="transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";
import HeaderComp from "@/components/Header.vue";
import LeftSideBar from "@/components/Left-SideBar.vue";
import ReloadPWA from "@/components/ReloadPWA.vue";
// import InstallPrompt from "@/components/InstallPrompt.vue";

export default {
  name: "App",
  components: {
    HeaderComp,
    LeftSideBar,
    ReloadPWA,
    // InstallPrompt,
    LoadingScreen: () => import("@/components/LoadingScreen.vue"),
  },
  setup() {},
  data() {
    return {
      isLeftSideBar: false,
      loading: {
        token: true,
        user: true,
      },
    };
  },
  mounted() {
    const token = window.localStorage.getItem("token");
    if (!token || token === "undefined") return;
    const decoded = jwtDecode(token);
    this.$store.commit("auth/SET_PROFILE", decoded);
    this.setLocation(decoded.sucursal);
    this.loading.token = false;
  },
  methods: {
    setLocation(locations) {
      const selectedLocation = localStorage.getItem("locationSelected");
      if (!selectedLocation || !locations.includes(selectedLocation)) {
        this.$store.commit("auth/SET_LOCATION_SELECTED", locations[0]);
        localStorage.setItem("locationSelected", locations[0]);
        return;
      }
      this.$store.commit("auth/SET_LOCATION_SELECTED", selectedLocation);
    },
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
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.noscroll {
  overflow: hidden;
  position: fixed;
}
.transition-enter-active,
.transition-leave-active {
  transition: all 0.6s ease;
}
.transition-enter-from,
.transition-leave-to {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}
</style>
