import React from 'react';
import styled from 'styled-components/native';

import { Text } from 'react-native';
import { Appbar, Colors, ActivityIndicator } from 'react-native-paper';

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

export default function Auth() {
  const { handleLogIn, handleLogOut, auth0State } = useAuth();

  const { message, subMessage, action } = (function renderSubComponents() {
    switch (auth0State.type) {
      case 'authorized':
        return {
          message: <Text>You are logged-in and authorized</Text>,
          subMessage: JSON.stringify(auth0State.credentials),
          action: <Appbar.Action icon="logout" onPress={handleLogOut} />,
        };

      case 'pending':
        return {
          message: (
            <>
              <Text>{auth0State.kind === 'login' ? 'Logging in' : 'Logging out'}</Text>
              <ActivityIndicator animating size="large" color={Colors.red500} />
            </>
          ),
          subMessage: 'pending',
          action: null,
        };

      case 'guest':
      default:
        return {
          message: <Text>Please log in</Text>,
          subMessage: 'log-in-first',
          action: <Appbar.Action icon="login" onPress={handleLogIn} />,
        };
    }
  })();

  return (
    <PageContainer>
      <>
        <ContentView>{message}</ContentView>
        <Appbar>
          {action}
          <Appbar.Content title="CRD" subtitle={subMessage} />
          <Appbar.Content title="URI" subtitle={REACT_APP_API_ENDPOINT} />
        </Appbar>
      </>
    </PageContainer>
  );
}
