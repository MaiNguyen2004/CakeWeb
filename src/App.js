import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from './pages/ProductManagement/ProductList'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import DashboardProductSeller from './pages/ProductManagement/Dashboard'
import { AuthProvider } from './context/AuthContext';
import AddProduct from "./pages/ProductManagement/AddProduct";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateProduct from "./pages/ProductManagement/UpdateProduct";
import ProfileDetail from "./pages/Profile/ProfileDetails";
import UpdateProfile from "./pages/Profile/UpdateProfile";
import Cart from "./pages/Cart";
import Checkout from "./pages/OrderManagement/Checkout";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardProductSeller />} />
          <Route path="/products/create" element={<AddProduct />} />
          <Route path="/products/update/:id" element={<UpdateProduct />} />
          <Route path="/profile" element={<ProfileDetail />} />
          <Route path="/updateProfile" element={<UpdateProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

        </Routes>
        <ToastContainer position="top-right" autoClose={2000} />

      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;
