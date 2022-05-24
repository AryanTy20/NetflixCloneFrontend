import React, { useState, useEffect } from "react";

export const useWindowResizer = () => {
  const [currentSize, setCurrentSize] = useState([
    window.innerHeight,
    window.innerWidth,
  ]);

  useEffect(() => {
    const resizeHandler = () => {
      setCurrentSize([window.innerHeight, window.innerWidth]);
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return currentSize;
};
