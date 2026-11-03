import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SIMPLE_MODE_STORAGE_KEY,
  SimpleModeContext,
} from "./simple-mode-context.js";

function readStoredPreference(): boolean {
  try {
    return window.localStorage.getItem(SIMPLE_MODE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function readUrlPreference(value: string | null): boolean | null {
  if (value === "1") return true;
  if (value === "0") return false;
  return null;
}

interface SimpleModeProviderProps {
  children: React.ReactNode;
}

export function SimpleModeProvider({ children }: SimpleModeProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlValue = searchParams.get("simple");

  const [isSimple, setIsSimple] = useState<boolean>(() => {
    const fromUrl = readUrlPreference(urlValue);
    return fromUrl ?? readStoredPreference();
  });

  // URL param wins over localStorage; keep state in sync on back/forward.
  useEffect(() => {
    const fromUrl = readUrlPreference(urlValue);
    setIsSimple(fromUrl ?? readStoredPreference());
  }, [urlValue]);

  const setSimple = useCallback(
    (active: boolean) => {
      setIsSimple(active);
      try {
        window.localStorage.setItem(SIMPLE_MODE_STORAGE_KEY, active ? "1" : "0");
      } catch {
        // Storage can be unavailable (private mode); URL state still works.
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

  const value = useMemo(
    () => ({ isSimple, setSimple }),
    [isSimple, setSimple]
  );

  return (
    <SimpleModeContext.Provider value={value}>
      {children}
    </SimpleModeContext.Provider>
  );
}
