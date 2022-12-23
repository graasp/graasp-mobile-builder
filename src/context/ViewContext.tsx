import React, { createContext, useState } from 'react';

interface ViewContextInterface {
  isPlayerView: boolean;
  setIsPlayerView: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewContext = createContext<ViewContextInterface | null>(null);
ViewContext.displayName = 'ViewContext';

const ViewProvider = (props: any) => {
  const [isPlayerView, setIsPlayerView] = useState<boolean>(false);

  const viewContext: ViewContextInterface = {
    isPlayerView,
    setIsPlayerView,
  };

  return <ViewContext.Provider value={viewContext} {...props} />;
};

const useView = () => {
  const context = React.useContext(ViewContext);
  if (context === undefined || context === null) {
    throw new Error(`Error in View Provider`);
  }
  return context;
};

export { ViewProvider, useView };
