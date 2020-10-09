import React from 'react';
import styled from 'styled-components/native';

import { gql, useQuery } from '@apollo/client';

import { Text } from 'react-native';
import { ActivityIndicator, Appbar, Colors, Button } from 'react-native-paper';

import PageContainer from './_Page';

import { useAuth } from '../features/useAuth';
import env from '../env.json';

const { REACT_APP_API_ENDPOINT } = env as Record<string, string>;

const ContentView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.lightBlue100};
`;

const ErrorMessage = styled.Text`
  color: ${Colors.red500};
`;

export default function Auth() {
  const { handleLogOut } = useAuth();

  /**
   * DATA
   */

  const { data, loading, error, refetch } = useQuery(
    gql`
      query MyQuery {
        usersList(first: 1) {
          count
          items {
            id
            firstName
            email
          }
        }
      }
    `,
    { fetchPolicy: 'network-only' },
  );

  /**
   * HANDLING
   */

  const handleRefetch = () => {
    console.info('refetch-requested');
    refetch();
  };

  /**
   * QUERY PRESENTAION
   */

  const queryResult = (function renderQ() {
    if (loading) {
      return (
        <>
          <Text>Fetching data...</Text>
          <ActivityIndicator animating size="large" color={Colors.red500} />
        </>
      );
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
   * GENERAL PRESENTATION
   */

  return (
    <PageContainer>
      <>
        <ContentView>{queryResult}</ContentView>
        <Appbar>
          <Appbar.Action icon="logout" onPress={handleLogOut} />
          <Appbar.Content title="URI" subtitle={REACT_APP_API_ENDPOINT} />
        </Appbar>
      </>
    </PageContainer>
  );
}
