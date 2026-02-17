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
import AdminMessages from "./pages/admin/AdminMessages.tsx";
import AdminOrders from "./pages/admin/AdminOrders";
import OrdersLogged from "./pages/OrdersLogged";
import TrackOrderGuest from "./pages/TrackOrderGuest";
import OrdersPage from "./pages/OrdersPage";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { RequireAuth, RequireAdmin } from "./routes/RequireAuth.tsx"

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/burgers" element={<Burguers />} />
        <Route path="/sides" element={<Sides />} />
        <Route path="/desserts" element={<Desserts />} />
        <Route path="/beverages" element={<Beverages />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/TrackOrderGuest" element={<TrackOrderGuest />} />

        <Route element={<RequireAuth />}>
          <Route path="/deleteaccount" element={<DeleteAccount />} />
          <Route path="/OrdersLogged" element={<OrdersLogged />} />
        </Route>

        <Route element={<RequireAdmin />}>
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>

      </Routes>
    </>
  )
}