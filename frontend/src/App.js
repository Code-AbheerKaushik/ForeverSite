import Navbar from "./components/navbar";
import Hero from "./components/hero";
import { Route, Routes, useLocation } from "react-router";
import About from "./components/about";
import Collection from "./components/collection";
import Contact from "./components/contact";
import Footer from "./components/footer";
import Login from "./components/login";
import Signup from "./components/signup";
import Profile from "./Profile";
import Product from "./components/product";
import Cart from "./components/cart";
import Checkout from "./components/checkout";
import OrderSuccess from "./components/order_success";
import UpiDemoPayment from "./components/upi_demo_payment";
import MyOrders from "./components/my_orders";
import AdminPanel from "./components/admin_panel";
import { useState } from "react";
import { useLocation as _useLocation } from "react-router";

function App() {
  const [searchtxt, setsearchtxt] = useState("");
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPath && <Navbar searchtxt={searchtxt} setsearchtxt={setsearchtxt}/>}
      <Routes>
        <Route path="/" element={<Hero/>} />
        <Route path="/about" element={<About/>}/>
        <Route path="/collection" element={<Collection searchtxt={searchtxt}/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/product/:id" element={<Product/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/order-success" element={<OrderSuccess/>}/>
        <Route path="/payment/demo" element={<UpiDemoPayment/>}/>
        <Route path="/my-orders" element={<MyOrders/>}/>
        {/* Admin — wildcard so nested routes inside AdminPanel work */}
        <Route path="/admin/*" element={<AdminPanel/>}/>
      </Routes>
      {!isAdminPath && <Footer/>}
    </>
  );
}

export default App;
