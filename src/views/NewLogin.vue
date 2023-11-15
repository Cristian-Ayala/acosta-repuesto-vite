<template>
  <div>
    <h2>ID Token Claims</h2>
    <button @click="login()">Log in</button>
    <pre>
      <code>idTokenClaims: {{ idTokenClaims }}</code>
      <code>user{{ user }}</code>
      isAuthenticated: {{ isAuthenticated }}
    </pre>
    <h6>{{ id_token }}</h6>
  </div>
</template>

<script>
import { useAuth0 } from "@auth0/auth0-vue";

export default {
  name: "LogInAuth0",
  setup() {
    const { loginWithRedirect, idTokenClaims, user, isAuthenticated } =
      useAuth0();

    return {
      login: () => {
        loginWithRedirect({
          appState: {
            returnTo: window.location.pathname,
          },
        });
      },
      idTokenClaims,
      /* eslint-disable no-underscore-dangle */
      id_token: idTokenClaims.__raw,
      user,
      isAuthenticated,
    };
  },
  watch: {
    idTokenClaims: {
      handler(token) {
        if (!token) return;
        window.localStorage.setItem("id_token", token.__raw);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
