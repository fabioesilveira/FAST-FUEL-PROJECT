import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type Meal = {
  id: string;
  name: string;
  category: string;      // 'sandwiches' | 'beverages' | 'sides' | 'desserts'
  description: string;
  image: string;
  price: number;
  quantidade: number;   // optional – only exists in cart
};


export type AppContextType = {
  order: Meal[];
  setOrder: Dispatch<SetStateAction<Meal[]>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within <AppProvider>');
  return ctx;
}

export { AppContext };
