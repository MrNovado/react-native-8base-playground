import React from "react";
import Auth0, { Credentials } from "react-native-auth0";

import { Text, StatusBar } from "react-native";
import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink, gql, useQuery } from "@apollo/client";
import { Observable } from "@apollo/client/utilities";

import styled from "styled-components/native";
import { Provider as PaperProvider, ActivityIndicator, Appbar, Colors, Button } from "react-native-paper";

import env from "./env.json";

/**
 * ==========================CONFIGURATION=====================================
 */

const {
  REACT_APP_WORKSPACE_ID,
  REACT_APP_API_ENDPOINT,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_AUTH_CLIENT_ID,
} = env as Record<string, string>;

/**
 * AUTH0
 */
const auth0Client = new Auth0({
  domain: REACT_APP_AUTH_DOMAIN,
  clientId: REACT_APP_AUTH_CLIENT_ID,
});

/**
 * GRAPHQL
 */
const globalAuthTokenRef: { current: Credentials | null } = { current: null };
const apolloClient = new ApolloClient({
  uri: REACT_APP_API_ENDPOINT,
  cache: new InMemoryCache(),
  /**
   * GRAPHQL-MIDDLEWARES
   */
  // link: ApolloLink.from([
  //   /**
  //    * AUTH-LINK
  //    */
  //   // new ApolloLink((operation, forward) => {
  //   //   operation.setContext(({ headers = {} }) => {
  //   //     const credentials = globalAuthTokenRef.current;
  //   //     console.info("request:setting-header", credentials ? "authorized" : "guest");
  //   //     return {
  //   //       headers: {
  //   //         ...headers,
  //   //         ...(credentials ? { authorization: `Bearer ${credentials.accessToken}` } : {}),
  //   //         workspace: REACT_APP_WORKSPACE_ID,
  //   //       },
  //   //     };
  //   //   });

  //   //   return forward ? forward(operation) : Observable.of();
  //   // }),
  //   /**
  //    * TEST-EMPTY-LINK
  //    */
  //   ApolloLink.empty(),
  // ]),
});

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <PaperProvider>
        <Content />
      </PaperProvider>
    </ApolloProvider>
  );
}

/**
 * ==========================PRESENTATION & FEATURES===========================
 */

const AppContentContainer = styled.SafeAreaView`
  flex: 1;
`;

const ContentView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.lightBlue100};
`;

const ErrorMessage = styled.Text`
  color: ${Colors.red500};
`;

function Content() {
  /**
   * DATA
   */

  const [credentials, setCredentials] = React.useState<Credentials | null>(null);
  const { data, loading, error, refetch } = useQuery(
    gql`
      query MyQuery {
        usersList {
          count
          items {
            id
            email
            firstName
          }
        }
      }
    `,
    { fetchPolicy: "network-only" },
  );

  /**
   * HANDLING
   */

  const handleRefetch = () => {
    console.info("refetch-requested");
    refetch();
  };

  const handleLogIn = () => {
    console.info("login-requested");
    auth0Client.webAuth
      .authorize({ scope: "openid email profile" })
      .then((credentials) => {
        setCredentials(credentials);
        return credentials;
      })
      .then((credentials) => console.info("user is authorized!", credentials))
      .catch((error) => console.error(error));
  };

  const handleLogOut = () => {
    console.info("logout-requested");
    auth0Client.webAuth
      .clearSession()
      .then(() => setCredentials(null))
      .then(() => console.info("logout successful"))
      .catch((error) => console.error(error));
  };

  /**
   * QUERY PRESENTAION
   */

  const queryResult = (function renderQ() {
    if (loading) {
      return <ActivityIndicator animating size="large" color={Colors.red500} />;
    }

    if (error) {
      const message = JSON.stringify(error, null, 2);
      return (
        <>
          <ErrorMessage>{message}</ErrorMessage>
          <Button icon="restart" mode="contained" onPress={handleRefetch}>
            Refetch
          </Button>
        </>
      );
    }

    if (data) {
      const message = JSON.stringify(data, null, 2);
      return (
        <>
          <Text>{message}</Text>
          <Button icon="restart" mode="contained" onPress={handleRefetch}>
            Refetch
          </Button>
        </>
      );
    }

    return <Text>Unknown Query State!</Text>;
  })();

  /**
   * GENERAL EFFECTS
   */

  React.useEffect(
    function invalidateCredentials() {
      globalAuthTokenRef.current = credentials;
    },
    [credentials],
  );

  /**
   * GENERAL PRESENTATION
   */

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppContentContainer>
        <ContentView>{queryResult}</ContentView>
        <Appbar>
          {credentials ? (
            <Appbar.Action icon="logout" onPress={handleLogOut} />
          ) : (
            <Appbar.Action icon="login" onPress={handleLogIn} />
          )}
          <Appbar.Content title="CRD" subtitle={credentials ? JSON.stringify(credentials) : "log-in-first"} />
          <Appbar.Content title="URI" subtitle={REACT_APP_API_ENDPOINT} />
        </Appbar>
      </AppContentContainer>
    </>
  );
}

export default App;
