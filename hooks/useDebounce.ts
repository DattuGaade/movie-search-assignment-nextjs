import { useEffect, useRef } from "react";

const useDebounce = (callback: Function, delay: number) => {
  const timerRef: any = useRef();

  useEffect(() => {
    return () => {
      if (timerRef) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return function debounceFunction(...args: any) {
    if (timerRef) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export default useDebounce;
