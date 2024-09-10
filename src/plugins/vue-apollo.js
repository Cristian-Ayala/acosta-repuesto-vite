import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  defaultDataIdFromObject,
} from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { jwtDecode } from "jwt-decode";

if (process.env.NODE_ENV) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_BACKEND_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem("token");
  if (!token || token === "undefined") return false;
  const decoded = jwtDecode(token);
  const defaultRole = decoded["https://hasura.io/jwt/claims"]["x-hasura-default-role"];

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
  dataIdFromObject: (responseObject) => {
    // Cases are DEMO only, just in case needed in the future
    switch (responseObject.__typename) {
      case "Product":
        return `Product:${responseObject.upc}`;
      case "User":
        return `User:${responseObject.name}:${responseObject.email}`;
      default:
        return defaultDataIdFromObject(responseObject);
    }
  },
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
        },
        acostarep_cliente: {
          merge: mergeFuction,
        },
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
