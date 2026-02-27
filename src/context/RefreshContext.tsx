import React, { createContext, useContext, useState } from "react";

type RefreshContextType = {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

const RefreshContext = createContext<RefreshContextType>({
  refresh: false,
  setRefresh: () => {},
});

export default RefreshContext;

export const RefreshProvider = ({ children }: Props) => {
  const [refresh, setRefresh] = useState(false);
  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

type Props = {
  children: React.ReactNode;
};
export const useRefresh = () => useContext(RefreshContext);
