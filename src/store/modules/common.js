import { ElMessage } from "element-plus";

export default () => ({
  namespaced: true,
  state: {},
  mutations: {
    errorNotification(state, message) {
      ElMessage({
        showClose: true,
        message,
        type: "error",
      });
    },
    successNotification(state, message) {
      ElMessage({
        showClose: true,
        message,
        type: "success",
      });
    },
  },
  actions: {},
});
