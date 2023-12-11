import { useRef } from "react";

export function useFocus() {
  const elFocus = useRef(null);
  const setFocus = () => {
    elFocus.current && elFocus.current.focus();
  };

  return [elFocus, setFocus];
}
