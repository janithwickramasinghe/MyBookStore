// src/Components/PrivateRoutes/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'admin') {
      return <Navigate to="/" />;
    }

    return children;
  } catch (err) {
    console.error("Token decoding failed:", err);
    return <Navigate to="/" />;
  }
};

export default AdminRoute;
