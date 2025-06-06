import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />}/>
    </Routes>
  ) 
}