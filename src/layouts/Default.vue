<template>
  <div id="app">
    <loading-screen v-if="loading.user && loading.token"></loading-screen>
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
import { mapMutations } from "vuex";
import { useAuth0 } from "@auth0/auth0-vue";
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
  setup() {
    const { idTokenClaims, user, isAuthenticated } = useAuth0();

    return {
      idTokenClaims,
      user,
      isAuthenticated,
    };
  },
  data() {
    return {
      isLeftSideBar: false,
      loading: {
        token: true,
        user: true,
      }
    };
  },
  watch: {
    idTokenClaims: {
      handler(token) {
        if (!token) return;
        /* eslint-disable no-underscore-dangle */
        window.localStorage.setItem("id_token", token.__raw);
        /* eslint-enable no-underscore-dangle */
        this.loading.token = false;
      },
    },
    user: {
      handler(user) {
        if (!user) return;
        localStorage.setItem("sucursales", JSON.stringify(user.metadata.sucursal));
        localStorage.setItem("userName", user.name);
        localStorage.setItem("email", user.email);
        localStorage.setItem("allowedRoles", JSON.stringify(user["https://hasura.io/jwt/claims"]["x-hasura-allowed-roles"]));
        const role = user["https://hasura.io/jwt/claims"]["x-hasura-allowed-roles"][0];
        localStorage.setItem("role", role);
        this.REVALIDATE_ABILITY_TO_MODIFY(role);
        this.setLocation(user.metadata.sucursal);
        localStorage.setItem("profilePicture", user.picture);
        this.loading.user = false;
      },
    },
  },
  mounted() {},
  methods: {
    ...mapMutations("auth", ["REVALIDATE_ABILITY_TO_MODIFY"]),
    setLocation(locations) {
      const selectedLocation = localStorage.getItem("locationSelected");
      if (!selectedLocation) {
        localStorage.setItem("locationSelected", locations[0]);
        return;
      }
      const isLocationSelectedInLocationsAllowed = locations.find((location) => location === selectedLocation);
      if (!isLocationSelectedInLocationsAllowed) {
        localStorage.setItem("locationSelected", locations[0]);
      }
    }
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
