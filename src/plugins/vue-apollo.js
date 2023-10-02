import { ApolloClient, ApolloLink, HttpLink } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (process.env.NODE_ENV) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_BACKEND_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem("id_token");
  const defaultRole = window.localStorage.getItem("role");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "x-hasura-role": defaultRole ? `${defaultRole}` : "",
    },
  };
});

const mergeFuction = (existing, incoming) => {
  const mergedData = {
    ...existing,
    ...incoming,
  };
  return mergedData;
};
const cache = new InMemoryCache({
  dataIdFromObject: (o) => o.id,
  typePolicies: {
    Query: {
      fields: {
        acostarep_marcas: {
          merge: mergeFuction,
        },
        acostarep_categorias: {
          merge: mergeFuction,
        },
        acostarep_productos: {
          merge: mergeFuction,
        }
      },
    },
  },
});

const link = ApolloLink.from([authLink, httpLink]);

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
  connectToDevTools: true,
});

export default ({ app }) => {
  /* eslint-disable-next-line */
  app.config.globalProperties.$apolloClient = apolloClient;
};
