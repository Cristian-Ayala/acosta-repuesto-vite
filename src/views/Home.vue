<template>
  <div class="page-holder w-100 d-flex flex-wrap">
    <home-bar></home-bar>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeBar from "@/components/HomeBar.vue";

export default {
  name: "HomeView",
  components: {
    HomeBar,
  },
  mounted() {
    const queryParams = new URLSearchParams(window.location.search);
    const errorValue = queryParams.get("errorasd");
    if (errorValue) this.$router.push({ name: "LogOut" });
  },
};
</script>
