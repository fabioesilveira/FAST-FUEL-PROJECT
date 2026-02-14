import { useEffect, useState, type ReactNode } from "react";
import { AppContext, type AppContextType, type Meal } from "./context";

const LS_KEY = "lsOrder";

export function AppProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<Meal[]>(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Meal[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(order));
  }, [order]);

  const contextValue: AppContextType = { order, setOrder };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}
