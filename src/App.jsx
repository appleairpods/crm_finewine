import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderSuccess from './pages/OrderSuccess';
import PhoneAuth from './components/PhoneAuth';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="success/:orderId" element={<OrderSuccess />} />
        </Route>
      </Routes>
      <PhoneAuth />
    </>
  );
}
