export default () => ({
  namespaced: true,
  state: {
    isAbleToModify: localStorage.getItem("role") === "gerente_area",
  },
  mutations: {},
  actions: {},
});
