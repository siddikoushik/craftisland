import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/common/Header'; // Changed from Navbar
import UserHome from './pages/UserHome';
import ProductDetails from './pages/ProductDetails';
import OwnerDashboard from './pages/OwnerDashboard';
import CartPage from './pages/CartPage';
import UserProfile from './pages/UserProfile';
import UserOrders from './pages/UserOrders';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import AuthPage from './pages/AuthPage';
import OwnerLogin from './pages/OwnerLogin';

// Inner component to access context
const AppRoutes = () => {
  const { userRole } = useApp();

  return (
    <div className="min-h-screen pb-20">
      {/* Show Header for both roles for now, or conditionally if Owner needs different one */}
      <Header />
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Owner Routes */}
        <Route path="/owner-login" element={<OwnerLogin />} />
        <Route
          path="/owner"
          element={userRole === 'owner' ? <OwnerDashboard /> : <Navigate to="/owner-login" replace />}
        />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
