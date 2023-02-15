<template>
  <div v-if="offlineReady || needRefresh" class="flex flex-wrap" role="alert" style="text-align: center;">
    <div class="message">
      <span v-if="offlineReady"> Aplicación lista </span>
      <span v-else>Nuevo contenido disponible, dar click en recargar para actualizar.</span>
    </div>
    <div style="margin-bottom: 1rem;">
      <el-button v-if="needRefresh" type="warning" @click="updateServiceWorker()"> Recargar </el-button>
      <el-button @click="close()"> Cerrar </el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";

// const { updateServiceWorker } = useRegisterSW();

export default defineComponent({
  name: "ReloadPWA",
  setup() {
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
    const close = async () => {
      offlineReady.value = false;
      needRefresh.value = false;
    };
    return { offlineReady, needRefresh, updateServiceWorker, close };
  },
});
</script>

<style scoped>
.message {
    padding: 0.5rem;
}
</style>