import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Burguers from "./pages/Burguers";
import Desserts from "./pages/Desserts";
import Beverages from "./pages/Beverages";
import Sides from "./pages/Sides";
import Checkout from "./pages/Checkout";
import DeleteAccount from "./pages/DeleteAccount";
import ContactUs from "./pages/ContactUs";
import Orders from "./pages/Orders";
import AdminMessages from "./pages/admin/AdminMessages";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/sign-up" element={<SignUp />}/>
      <Route path="/burguers" element={<Burguers />}/>
      <Route path="/sides" element={<Sides />}/>
      <Route path="/desserts" element={<Desserts />}/>
      <Route path="/beverages" element={<Beverages />}/>
      <Route path="/checkout" element={<Checkout />}/>
      <Route path="/deleteaccount" element={<DeleteAccount/>}/>
      <Route path="/contact-us" element={<ContactUs />}/>
      <Route path="/orders" element={<Orders />}/>
      <Route path="/admin/messages" element={<AdminMessages/>}/>
    </Routes>
  ) 
}