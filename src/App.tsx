import React from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar} from 'react-native';
import {ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery} from '@apollo/client';

import env from './env.json';

const {REACT_APP_API_ENDPOINT} = env as Record<string, string>;

const client = new ApolloClient({
  uri: REACT_APP_API_ENDPOINT,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Content />
    </ApolloProvider>
  );
}

function Content() {
  const {data, loading, error, refetch} = useQuery(gql`
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
  `);

  const queryResult = (function renderQ() {
    if (loading) {
      return <Text>Loading!</Text>;
    }

    if (error) {
      const message = JSON.stringify(error, null, 2);
      return <Text style={styles.error}>{message}</Text>;
    }

    if (data) {
      const message = JSON.stringify(data, null, 2);
      return <Text>{message}</Text>;
    }

    return <Text>Unknown Query State!</Text>;
  })();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View>
            <Text>URI: {REACT_APP_API_ENDPOINT}</Text>
          </View>
          <View style={styles.body}>{queryResult}</View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
  scrollView: {
    backgroundColor: 'white',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
  },
  footer: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
