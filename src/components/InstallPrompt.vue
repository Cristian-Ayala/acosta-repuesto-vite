<template>
  <!-- <div v-if="deferredPrompt"> -->
  <div>
    <b-container v-if="deferredPrompt" fluid class="bg-white banner">
      <b-row class="p-2">
        <b-col class="d-flex align-items-center justify-content-center"
        >Instalar Aplicación en tu celular o computadora.</b-col
        >
        <b-col v-if="windowWidth >= 900" class="text-center">
          <b-button variant="danger" class="mr-2" @click="dismiss()"
          >Cancelar</b-button
          >
          <b-button variant="success" @click="install()">Instalar</b-button>
        </b-col>
      </b-row>
      <b-row v-if="windowWidth < 900" class="p-3 justify-content-center">
        <b-col style="text-align: end">
          <b-button variant="danger" @click="dismiss()">Cancelar</b-button>
        </b-col>
        <b-col>
          <b-button variant="success" @click="install()"
          >Instalar</b-button
          ></b-col
        >
      </b-row>
    </b-container>
    <transition name="fade"
    ><div v-if="deferredPrompt" class="fondoNegro"></div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "InstallPrompt",
  data() {
    return {
      deferredPrompt: null,
      windowWidth: window.innerWidth,
    };
  },
  created() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      if(!window.localStorage.getItem("instalar")){
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
      }
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });

    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },
  methods: {
    async dismiss() {
      window.localStorage.setItem("instalar","false");
      this.deferredPrompt = null;
    },
    async install() {
      // Se puede agregar una validacion si el usuario presionó cancelar, así el evento no se registrará
      this.deferredPrompt.prompt();
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
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.banner {
  position: fixed ;
  z-index: 100;
}
</style>