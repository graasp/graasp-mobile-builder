import * as Linking from 'expo-linking';
import React, { createContext } from 'react';

interface DeepLinkContextInterface {
  hostname: string | null;
  path: string | null;
  queryParams: Linking.QueryParams | null;
  scheme: string | null;
}

const DeepLinkContext = createContext<DeepLinkContextInterface | null>(null);
DeepLinkContext.displayName = 'DeepLinkContext';

const DeepLinkProvider = (props: any) => {
  const deepLink = Linking.useURL();

  let parsedDeepLink = null;
  if (deepLink) {
    parsedDeepLink = Linking.parse(deepLink);
  }

  const deepLinkContext: DeepLinkContextInterface = {
    hostname: parsedDeepLink?.hostname || null,
    path: parsedDeepLink?.path || null,
    queryParams: parsedDeepLink?.queryParams || null,
    scheme: parsedDeepLink?.scheme || null,
  };

  return <DeepLinkContext.Provider value={deepLinkContext} {...props} />;
};

const useDeepLink = () => {
  const context = React.useContext(DeepLinkContext);
  if (context === undefined) {
    throw new Error(`useDeepLink must be used within a DeepLinkProvider`);
  }
  return context;
};

export { DeepLinkProvider, useDeepLink };
