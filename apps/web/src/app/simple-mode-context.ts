import { createContext } from "react";

export const SIMPLE_MODE_STORAGE_KEY = "danaterbuka.simple";

export interface SimpleModeContextValue {
  isSimple: boolean;
  setSimple: (active: boolean) => void;
}

export const SimpleModeContext = createContext<SimpleModeContextValue | null>(null);
