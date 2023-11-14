<template>
  <div>
    <div class="wrapper"><el-avatar :size="250" src="img/coding.webp" /></div>
    <div>
      <h6>
        Todavía no tienes acceso a la aplicación. Configuraremos tu cuenta.
      </h6>
    </div>
    <div class="logOutClass">
      <el-button size="large" round @click="logout()">Salir</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LogOut",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
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
.wrapper {
  text-align: center;
  padding-top: 5rem;
  padding-bottom: 5rem;
}
h6 {
  text-align: center;
}
.logOutClass {
  bottom: 0;
  position: fixed;
  padding-bottom: 3rem;
  left: 40%;
}
</style>
