import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "danaterbuka.simple";

export function useSimpleMode(): [boolean, (active: boolean) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitial = (): boolean => {
    const urlVal = searchParams.get("simple");
    if (urlVal === "1") return true;
    if (urlVal === "0") return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  };

  const [isSimple, setIsSimple] = useState<boolean>(getInitial);

  useEffect(() => {
    const urlVal = searchParams.get("simple");
    if (urlVal === "1" && !isSimple) {
      setIsSimple(true);
    } else if (urlVal === "0" && isSimple) {
      setIsSimple(false);
    }
  }, [searchParams, isSimple]);

  const setSimple = useCallback(
    (active: boolean) => {
      setIsSimple(active);
      try {
        localStorage.setItem(STORAGE_KEY, active ? "1" : "0");
      } catch {
        // ignore
      }
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (active) {
            next.set("simple", "1");
          } else {
            next.delete("simple");
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return [isSimple, setSimple];
}
