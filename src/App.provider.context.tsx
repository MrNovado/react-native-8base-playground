import React from 'react';
import { Credentials } from 'react-native-auth0';
import { globalRefAuth0State } from './App.config.apollo';
import { Auth0State } from './App.config.common';

type AppContext = {
  auth0State: Auth0State;
};

const appContextInitial: AppContext = {
  auth0State: { type: 'guest' },
};

export const AppContext = React.createContext(appContextInitial);

export const AppContextUpdate = React.createContext<React.Dispatch<AppContextUpdateEvents>>(() =>
  console.error('Init the event dispatcher!'),
);

type AppContextUpdateEvents =
  | { type: '@auth/auth0-state-update-requested'; kind: 'login' | 'logout' }
  | { type: '@auth/new-credentials-received'; credentials: Credentials | null };

/**
 * @notes
 * (1):
 * apollo links are reading creds via globalRef
 * so we have to update it as well;
 * it makes the reducer technically not-pure
 * as mutating a ref is an effect;
 * but it doesn't hurt either; for the time being
 */
function appContextReducer(state: AppContext, event: AppContextUpdateEvents) {
  console.info('event', event);

  switch (event.type) {
    case '@auth/auth0-state-update-requested': {
      const newAuth0State: Auth0State = { type: 'pending', kind: event.kind };
      {
        /**
         * @note 1
         */
        globalRefAuth0State.current = newAuth0State;
      }
      return {
        ...state,
        auth0State: newAuth0State,
      };
    }

    case '@auth/new-credentials-received': {
      const { credentials } = event;
      const newAuth0State: Auth0State = credentials
        ? { type: 'authorized', credentials }
        : { type: 'guest' };
      {
        /**
         * @note 1
         */
        globalRefAuth0State.current = newAuth0State;
      }
      return {
        ...state,
        auth0State: newAuth0State,
      };
    }

    default:
      return state;
  }
}

export function AppContextProvider(props: { children: JSX.Element }) {
  const [state, send] = React.useReducer(appContextReducer, appContextInitial);

  return (
    <AppContext.Provider value={state}>
      <AppContextUpdate.Provider value={send}>{props.children}</AppContextUpdate.Provider>
    </AppContext.Provider>
  );
}
