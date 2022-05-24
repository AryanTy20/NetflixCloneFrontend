import { useContext } from "react";
import { globalContext } from "../context";

export const useGlobalState = () => {
  return useContext(globalContext);
};
