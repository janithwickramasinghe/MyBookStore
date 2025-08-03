
import './App.css';
import React from 'react';
import HomePage from './Pages/HomePage/HomePage'
import { Routes, Route, Router } from "react-router"
import Login from './Components/Login/Login';
import AddBook from './Components/AddBook/AddBook';
import ViewBooks from './Components/ViewBooks/ViewBooks';
import Register from './Components/Register/Register';
import OTPVerification from './Components/OTPVerification';
import BookPage from './Pages/BookPage/BookPage';
import CartPage from './pages/CartPage/CartPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import PrivateRoute from './Components/PrivateRoutes/PrivateRoutes';
import OrdersPage from './Pages/OrdersPage/OrdersPage';
import AdminOrdersDashboard from './Pages/AdminOrdersDashboard/AdminOrdersDashboard';
import UserProfile from './Pages/UserProfile/UserProfile';
import AdminRoute from './Components/PrivateRoutes/AdminRoutes';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ResetPassword from './Pages/ResetPassword/ResetPassword';

function App() {

  return (
    <div >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/addbook" element={<AdminRoute><AddBook /></AdminRoute>} />
        <Route path="/viewbooks" element={<AdminRoute><ViewBooks /></AdminRoute>} />
        <Route path="/admin-orders" element={<AdminRoute><AdminOrdersDashboard /></AdminRoute>} />a
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/home" element={<HomePage />} /> 
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/cart" element={
          <PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="/user-profile/:id" element={<UserProfile />} />
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard/></AdminRoute>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword/>}/>
      </Routes>
    </div>
  );
}

export default App;
