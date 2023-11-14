<template>
  <div class="clientes">
    <el-skeleton style="display: flex; width: 100%" animated>
      <template #template>
        <div id="leftSide">
          <el-skeleton-item
            variant="image"
            style="width: 3rem; height: 3rem; border-radius: 5rem"
          />
        </div>
        <div id="rigthSide">
          <el-skeleton-item variant="text" />
          <el-skeleton-item variant="text" style="width: 30%" />
          <el-skeleton-item variant="text" style="width: 50%" />
          <el-skeleton-item variant="text" style="width: 60%" />
          <el-skeleton-item variant="text" style="width: 90%" />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
export default {
  name: "ClientesViewLoading",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.clientes {
  padding: 0.5rem;
  display: grid;
  align-items: center;
  margin: 0.5rem 0.5rem;
  box-shadow: 0 0.125rem 0.8rem rgb(0 0 0 / 10%);
  background-color: #fff;
  border-radius: 1rem;
}
.clienteName {
  font-size: 1rem;
  font-weight: bold;
}
#leftSide {
  padding: 1rem;
  align-self: center;
}
#rigthSide {
  width: 100%;
}
</style>
