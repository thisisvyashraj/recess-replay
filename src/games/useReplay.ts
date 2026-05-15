import { createContext, useContext } from "react";

export const ReplayContext = createContext<() => void>(() => {
  // fallback: hard reload if not inside provider
  if (typeof window !== "undefined") window.location.reload();
});

export const useReplay = () => useContext(ReplayContext);
