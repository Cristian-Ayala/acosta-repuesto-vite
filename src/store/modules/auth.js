export default () => ({
  namespaced: true,
  state: {
    // esto debe cambiar si cambia algo más
    isAbleToModify: null,
    userProfile: {
      id: null,
      email: null,
      roles: [],
      sucursal: [],
      active: false,
      "https://hasura.io/jwt/claims": {
        "x-hasura-default-role": null,
        "x-hasura-allowed-roles": [],
        "x-hasura-user-id": null,
        "x-hasura-user-email": null,
      },
      locationSelected: null,
      defaultRole: null,
    },
  },
  mutations: {
    SET_PROFILE(state, userProfile) {
      state.userProfile = userProfile;
      state.userProfile.defaultRole = userProfile["https://hasura.io/jwt/claims"]["x-hasura-default-role"];
      state.isAbleToModify = state.userProfile.defaultRole === "gerente_area";
    },
    SET_LOCATION_SELECTED(state, location) {
      state.userProfile.locationSelected = location;
    }
  },
  actions: {},
});
