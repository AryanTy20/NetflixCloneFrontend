import { useEffect } from "react";

export const useOnClickOutside = (arrRef, handler) => {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        const allRef = [];
        const filterRef =
          arrRef.length > 0 && arrRef.filter((el) => el.current);
        filterRef.length > 0 &&
          filterRef.forEach((elRef) => {
            if (!elRef.current || elRef.current.contains(event.target)) {
              allRef.push(true);
            }
          });
        if (allRef.length > 0) return;
        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [arrRef, handler]
  );
};
