import Auth0 from 'react-native-auth0';
import env from './env.json';

const { REACT_APP_AUTH_DOMAIN, REACT_APP_AUTH_CLIENT_ID } = env as Record<string, string>;

export const auth0Client = new Auth0({
  domain: REACT_APP_AUTH_DOMAIN,
  clientId: REACT_APP_AUTH_CLIENT_ID,
});
