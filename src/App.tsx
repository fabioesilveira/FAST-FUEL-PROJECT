import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sandwiches from "./pages/Sandwiches";
import Desserts from "./pages/Desserts";
import Beverages from "./pages/Beverages";
import Sides from "./pages/Sides";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/sign-up" element={<SignUp />}/>
      <Route path="/sandwiches" element={<Sandwiches />}/>
      <Route path="/sides" element={<Sides />}/>
      <Route path="/desserts" element={<Desserts />}/>
      <Route path="/beverages" element={<Beverages />}/>
      <Route path="/checkout" element={<Checkout />}/>
    </Routes>
  ) 
}