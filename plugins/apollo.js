



import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { createApolloProvider } from "@vue/apollo-option";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from '@apollo/client/link/context';


const authMiddleware = setContext((_, { headers }) => {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      Authorization: token ? `JWT ${token}` : '',
    },
  };
});

function buildApolloClient(optionsLink) {
  return new ApolloClient({ 
    link: authMiddleware.concat(createUploadLink(optionsLink)), 
    cache: new InMemoryCache() 
  })
}


export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const { apiBaseUrl } = config.public

  const apolloClient = buildApolloClient({
    uri: `${apiBaseUrl}/api-dine-up/`
  })
  
  const apolloProvider = createApolloProvider({
    defaultClient: apolloClient,
  });

  nuxtApp.vueApp.use(apolloProvider)
})












// import {
//   ApolloClient,
//   InMemoryCache,
//   createHttpLink,
// } from "@apollo/client/core";
// import {
//   DefaultApolloClient,
//   provideApolloClient,
// } from "@vue/apollo-composable";
// import type { NuxtApp } from "#app";
// import { defineNuxtPlugin } from "#app";

// export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
//   const httpLink = createHttpLink({
//     uri: "", // your endpoint
//     headers: {
//       // your headers
//     },
//   });

//   const cache = new InMemoryCache();

//   let apolloClient: ApolloClient<any>;

//   if (process.server) {
//     apolloClient = new ApolloClient({
//       ssrMode: true,
//       link: httpLink,
//       cache,
//     });
//     nuxtApp.hook("app:rendered", () => {
//       nuxtApp.payload.data.apollo = apolloClient.extract();
//     });
//   } else {
//     apolloClient = new ApolloClient({
//       link: httpLink,
//       cache,
//     });
//   }

//   provideApolloClient(apolloClient);
//   nuxtApp.provide("apollo", { DefaultApolloClient, apolloClient });
// });


