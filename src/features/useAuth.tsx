import React from 'react';
import { Credentials } from 'react-native-auth0';
import { auth0Client } from '../App.config.auth0';
import { AppContext, AppContextUpdate } from '../App.provider.context';

/**
 * Use this hook to update auth state
 */
export function useAuth() {
  const { auth0State } = React.useContext(AppContext);
  const appContextUpdate = React.useContext(AppContextUpdate);

  const setCredentials = (credentials: Credentials | null) => {
    appContextUpdate({
      type: '@auth/new-credentials-received',
      credentials,
    });
  };

  const notifyAuth0StateUpdateRequested = (kind: 'login' | 'logout') => {
    appContextUpdate({
      type: '@auth/auth0-state-update-requested',
      kind,
    });
  };

  const handleLogIn = () => {
    notifyAuth0StateUpdateRequested('login');
    return auth0Client.webAuth
      .authorize({ scope: 'openid email profile' })
      .then(credentials => {
        setCredentials(credentials);
        return credentials;
      })
      .then(credentials => console.info('user is authorized!', credentials))
      .catch(error => {
        console.error(error);
        setCredentials(null);
      });
  };

  const handleLogOut = () => {
    notifyAuth0StateUpdateRequested('logout');
    return auth0Client.webAuth
      .clearSession()
      .then(() => setCredentials(null))
      .then(() => console.info('logout successful'))
      .catch(error => {
        console.error(error);
        setCredentials(null);
      });
  };

  return { handleLogIn, handleLogOut, auth0State };
}
