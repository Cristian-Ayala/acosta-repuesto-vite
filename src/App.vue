<template>
  <div id="app">
    <component :is="layout">
    </component>
  </div>
</template>

<script>
import Default from "@/layouts/Default.vue"
import Blank from "@/layouts/Blank.vue"

const layouts = {
  Default,
  Blank
}
export default {
  name: "App",
  data() {
    return {}
  },
  computed: {
    layout() {
      const defaultLayout = this.$route.meta.layout || "Default"
      return layouts[defaultLayout]
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
.noscroll {
  overflow: hidden;
  position: fixed;
}
</style>