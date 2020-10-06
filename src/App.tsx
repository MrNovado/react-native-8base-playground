import React from "react";
import Auth0 from "react-native-auth0";

import { Text, StatusBar } from "react-native";
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from "@apollo/client";

import styled from "styled-components/native";
import { Provider as PaperProvider, ActivityIndicator, Appbar, Colors, Button } from "react-native-paper";

import env from "./env.json";

const { REACT_APP_API_ENDPOINT, REACT_APP_AUTH_DOMAIN, REACT_APP_AUTH_CLIENT_ID } = env as Record<string, string>;

const auth0 = new Auth0({
  domain: REACT_APP_AUTH_DOMAIN,
  clientId: REACT_APP_AUTH_CLIENT_ID,
});

const client = new ApolloClient({
  uri: REACT_APP_API_ENDPOINT,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <PaperProvider>
        <Content />
      </PaperProvider>
    </ApolloProvider>
  );
}

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
  const [credentials, setCredentials] = React.useState<any>(null);
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

  const handleRefetch = () => {
    console.info("refetch-requested");
    refetch();
  };

  const handleLogIn = () => {
    console.info("login-requested");
    auth0.webAuth
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
    auth0.webAuth
      .clearSession()
      .then(() => setCredentials(null))
      .then(() => console.info("logout successful"))
      .catch((error) => console.error(error));
  };

  const queryResult = (function renderQ() {
    if (loading) {
      return <ActivityIndicator animating size="large" color={Colors.red500} />;
    }

    if (error) {
      const message = JSON.stringify(error, null, 2);
      return <ErrorMessage>{message}</ErrorMessage>;
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

  const auth0Actions = (function renderAuthActions() {
    if (credentials) {
      return <Appbar.Action icon="logout" onPress={handleLogOut} />;
    } else {
      return <Appbar.Action icon="login" onPress={handleLogIn} />;
    }
  })();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppContentContainer>
        <ContentView>{queryResult}</ContentView>
        <Appbar>
          {auth0Actions}
          <Appbar.Content title="CRD" subtitle={credentials ? JSON.stringify(credentials) : "log-in-first"} />
          <Appbar.Content title="URI" subtitle={REACT_APP_API_ENDPOINT} />
        </Appbar>
      </AppContentContainer>
    </>
  );
}

export default App;
