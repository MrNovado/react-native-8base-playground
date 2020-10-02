import React from "react";
import { Text, StatusBar } from "react-native";
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from "@apollo/client";

import styled from "styled-components/native";
import { Provider as PaperProvider, ActivityIndicator, Appbar, Colors, Button } from "react-native-paper";

import env from "./env.json";

const { REACT_APP_API_ENDPOINT } = env as Record<string, string>;

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
    { fetchPolicy: "no-cache" },
  );

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
          <Button icon="restart" mode="contained" onPress={refetch}>
            Refetch
          </Button>
        </>
      );
    }

    return <Text>Unknown Query State!</Text>;
  })();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppContentContainer>
        <ContentView>{queryResult}</ContentView>
        <Appbar>
          <Appbar.Action icon="restart" onPress={refetch} />
          <Appbar.Content title="URI" subtitle={REACT_APP_API_ENDPOINT} />
        </Appbar>
      </AppContentContainer>
    </>
  );
}

export default App;
