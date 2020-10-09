import React from 'react';
import { AppContext } from '../App.provider.context';

/**
 * Use this context to read state (no update handlers included; only reading)
 */
export function useAppContext() {
  const appContext = React.useContext(AppContext);

  return appContext;
}
