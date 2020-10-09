import React from 'react';
import { GraphqlProvider } from './App.provider.apollo';
import { AppContextProvider } from './App.provider.context';
import { PaperProvider } from './App.provider.paper';

import Routing from './App.routing';

export default function App() {
  return (
    <AppContextProvider>
      <GraphqlProvider>
        <PaperProvider>
          <Routing />
        </PaperProvider>
      </GraphqlProvider>
    </AppContextProvider>
  );
}
