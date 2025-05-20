import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import OwnerLogin from './pages/OwnerAuth/OwnerLogin/OwnerLogin';
import OwnerRegister from './pages/OwnerAuth/OwnerRegister/OwnerRegister';
import OwnerDashboard from './pages/RestaurantManagment/OwnerDashboard/OwnerDashboard';
import RestaurantPage from './pages/RestaurantManagment/RestaurantPage/RestaurantPage';
import Restaurant from './pages/Restaurant/Restaurant';
import Order from './pages/Order/Order';
import ManageOrders from './pages/RestaurantManagment/ManageOrders/ManageOrders';
import { Toaster } from 'sonner';
import DeliveryLogin from './pages/DeliveryPages/DeliveryLogin/DeliveryLogin';
import DeliveryRegister from './pages/DeliveryPages/DeliveryRegister/DeliveryRegister';
import DeliveryDashboard from './pages/DeliveryPages/DeliveryDashboard/DeliveryDashboard';
import MyOrders from './pages/MyOrders/MyOrders';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Register />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/owner-registration" element={<OwnerRegister />} />
          <Route path="/delivery-login" element={<DeliveryLogin />} />
          <Route path="/delivery-registration" element={<DeliveryRegister />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/restaurant-management/:slug" element={<RestaurantPage />} />
          <Route path="/manageOrders/:slug" element={<ManageOrders />} />
          <Route path="/restaurant/:slug" element={<Restaurant />} />
          <Route path="/makeOrder" element={<Order />} />
          <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
          <Route path="/my-orders" element={<MyOrders />} />

        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </>

  )
}

export default App
