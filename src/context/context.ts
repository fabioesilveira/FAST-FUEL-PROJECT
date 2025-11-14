import { createContext, useContext } from "react";

export type Meal = {
  id: string,
  name: string,
  type: string,
  description: string,
  image: string,
  price: number,
  quantidade: number
}

export type AppContextType = {
  order: Meal[];
  setOrder: React.Dispatch<React.SetStateAction<Meal[]>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within <AppProvider>');
  return ctx;
}
export { AppContext };