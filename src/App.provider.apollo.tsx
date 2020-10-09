import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './App.config.apollo';

export function GraphqlProvider(props: { children: JSX.Element }) {
  return <ApolloProvider client={apolloClient}>{props.children}</ApolloProvider>;
}
