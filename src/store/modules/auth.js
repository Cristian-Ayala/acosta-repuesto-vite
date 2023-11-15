export default () => ({
  namespaced: true,
  state: {
    // esto debe cambiar si cambia algo más
    isAbleToModify: localStorage.getItem("role") === "gerente_area",
  },
  mutations: {
    REVALIDATE_ABILITY_TO_MODIFY(state, role) {
      state.isAbleToModify = role === "gerente_area";
    }
  },
  actions: {},
});
