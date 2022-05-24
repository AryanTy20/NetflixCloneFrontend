import { createContext, useState } from "react";

export const globalContext = createContext({});

const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({});
  return (
    <>
      <globalContext.Provider value={{ globalState, setGlobalState }}>
        {children}
      </globalContext.Provider>
    </>
  );
};

export default GlobalStateProvider;
