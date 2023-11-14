import { createAuth0 } from "@auth0/auth0-vue";

export default ({ app }) => {
  app.use(
    createAuth0({
      domain: import.meta.env.VITE_DOMAIN,
      clientId: import.meta.env.VITE_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
      response_type: "token id_token",
    }),
  );
};
