import isLoggedIn from "../../router/middleware/auth";

const rejectPromise = (message) => new Promise((resolve, reject) => {
  reject(new Error(message));
});

export default (app) => ({
  namespaced: true,
  state: {
    localUsuarios: null,
    usuario: {},
    usuarios: [],
    showModalEdit: false,
    actualUser: {},
    users: null,
  },
  mutations: {
    clearData(state) {
      state.usuario = {};
    },
    setUser(state, user) {
      state.usuario = user;
    },
    setModalEditShow(state, value) {
      console.log("Click");
      state.showModalEdit = value;
    },
    alertNotification(state, { message, duration }) {
      this.$awn.alert(message, {
        durations: {
          success: duration,
        },
      });
    },
    successNotification(state, { message, duration, tittle }) {
      this.$awn.success(message, {
        durations: {
          success: duration,
        },
        labels: {
          success: tittle,
        },
      });
    },
  },
  actions: {
    createRegistro() {
    },
    async getAllUsuarios() {
      if (!isLoggedIn()) {
        rejectPromise("No está logueado");
        return null;
      }
      const role = localStorage.getItem("role");
      if (role !== "general_manager" && role !== "manager") {
        rejectPromise("No tiene permitido ver las estadísticas de todos los usuarios, solo podrá ver las suyas");
        return null;
      }
      const settings = {
        method: "GET",
        credentials: "include",
      };
      let findOrAllDocs = "_all_docs";
      if (role === "manager") {
        settings.method = "POST";
        findOrAllDocs = "_find";
        settings.headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };
        settings.body = JSON.stringify({ selector: { organization_unit: localStorage.getItem("org_division"), "roles": { "$in": ["member"]} } });
      }
      const response = await fetch(`${app.config.globalProperties.$url}users/${findOrAllDocs}?include_docs=true`, settings);
      const res = await response.json();
      if (res.rows != null) this.users = res.rows.map(user => user.doc);
      else if (res.docs != null) this.users = res.docs;
      else this.users = null;
      return this.users;
    },
    editRegistro() {
    },
    removeRegistro() {
    },
    logout() {
      localStorage.removeItem("org_division");
      return fetch(`${import.meta.env.VITE_BACKEND_URL}_session`, { method: "DELETE", credentials: "include" });
    },
  },
});
