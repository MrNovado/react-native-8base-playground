import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Auth0State } from './App.config.common';
import env from './env.json';

const { REACT_APP_WORKSPACE_ID, REACT_APP_API_ENDPOINT } = env as Record<string, string>;

export const globalRefAuth0State: { current: Auth0State } = { current: { type: 'guest' } };
export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  /**
   * GRAPHQL-MIDDLEWARES
   */
  link: ApolloLink.from([
    /**
     * AUTH -- mutating headers
     */

    new ApolloLink((operation, forward) => {
      operation.setContext(({ headers = {} }) => {
        const auth0State = globalRefAuth0State.current;
        switch (auth0State.type) {
          case 'authorized': {
            return {
              headers: {
                ...headers,
                Authorization: `Bearer ${auth0State.credentials.idToken}`,
                workspace: REACT_APP_WORKSPACE_ID,
              },
            };
          }

          case 'pending':
          case 'guest':
          default: {
            return {
              headers: {
                ...headers,
                workspace: REACT_APP_WORKSPACE_ID,
              },
            };
          }
        }
      });

      return forward?.(operation);
    }),

    /**
     * ERROR -- logging network / cache errors
     */

    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      }

      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
    }),

    /**
     * HTTP -- setting endpoint uri
     */

    new HttpLink({ uri: REACT_APP_API_ENDPOINT }),
  ]),
});
