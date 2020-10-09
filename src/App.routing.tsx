import React from 'react';
import { NativeRouter, Route } from 'react-router-native';

import { useAppContext } from './features/useAppContext';

import Auth from './pages/Auth';
import Fetch from './pages/FetchTest';

export default function Router() {
  const { auth0State } = useAppContext();

  const routes = (function renderRoutes() {
    switch (auth0State.type) {
      case 'authorized': {
        console.info('route:fetch');
        return <Route component={Fetch} />;
      }

      case 'guest':
      default: {
        console.info('route:auth');
        return <Route component={Auth} />;
      }
    }
  })();

  return <NativeRouter>{routes}</NativeRouter>;
}
