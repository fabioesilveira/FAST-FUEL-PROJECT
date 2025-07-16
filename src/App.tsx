import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Sandwiches from "./pages/Sandwiches";
import Desserts from "./pages/Desserts";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/sign-up" element={<SignUp />}/>
      <Route path="/sandwiches" element={<Sandwiches />}/>
      <Route path="/desserts" element={<Desserts />}/>
    </Routes>
  ) 
}