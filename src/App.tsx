import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/SignUp.tsx";
import SignIn from "./pages/auth/SignIn.tsx";
import Home from "./pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import Burgers from "./pages/products/Burgers.tsx";
import Desserts from "./pages/products/Desserts.tsx";
import Beverages from "./pages/products/Beverages.tsx";
import Sides from "./pages/products/Sides.tsx";
import Checkout from "./pages/Checkout";
import DeleteAccount from "./pages/DeleteAccount";
import ContactUs from "./pages/Contact.tsx";
import AdminMessages from "./pages/admin/AdminMessages.tsx";
import AdminOrders from "./pages/admin/AdminOrders";
import OrdersLogged from "./pages/orders/TrackOrderLogged.tsx";
import TrackOrderGuest from "./pages/orders/TrackOrderGuest.tsx";
import OrdersPage from "./pages/orders/OrdersEntry.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { RequireAuth, RequireAdmin } from "./routes/RequireAuth.tsx"
import Reviews from "./pages/Reviews.tsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/burgers" element={<Burgers />} />
        <Route path="/sides" element={<Sides />} />
        <Route path="/desserts" element={<Desserts />} />
        <Route path="/drinks" element={<Beverages />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/TrackOrderGuest" element={<TrackOrderGuest />} />
        <Route path="/reviews" element={<Reviews />} />

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