<template>
  <el-skeleton style="width: 9rem" animated>
    <template #template>
      <el-skeleton-item variant="image" style="width: 9rem; height: 9rem" />
      <div style="padding: 14px">
        <el-skeleton-item variant="h3" style="width: 50%" />
        <div
          style="
            display: flex;
            align-items: center;
            justify-items: space-between;
            margin-top: 16px;
            height: 16px;
          "
        >
          <el-skeleton-item variant="text" style="margin-right: 16px" />
          <el-skeleton-item variant="text" style="width: 30%" />
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<script>
export default {
  name: "LoadingProductos",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style scoped></style>
