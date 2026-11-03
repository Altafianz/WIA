import { useContext } from "react";
import { SimpleModeContext } from "../app/simple-mode-context.js";

export function useSimpleMode(): [boolean, (active: boolean) => void] {
  const context = useContext(SimpleModeContext);
  if (!context) {
    throw new Error("useSimpleMode must be used inside SimpleModeProvider");
  }
  return [context.isSimple, context.setSimple];
}
