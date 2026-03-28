import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from './pages/Product'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardProductSeller from './pages/ProductManagement/Dashboard'
import { AuthProvider } from './context/AuthContext';

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

        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;
