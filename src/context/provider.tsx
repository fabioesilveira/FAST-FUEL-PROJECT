import { useState, type ReactNode } from "react";
import { AppContext, type AppContextType, type Meal } from "./context";

export function AppProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<Meal[]>([]);

  const contextValue: AppContextType = {
    order,
    setOrder,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}