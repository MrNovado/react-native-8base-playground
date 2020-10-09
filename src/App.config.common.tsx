import { Credentials } from 'react-native-auth0';

export type Auth0State =
  | { type: 'authorized'; credentials: Credentials }
  | { type: 'pending'; kind: 'login' | 'logout' }
  | { type: 'guest' };
