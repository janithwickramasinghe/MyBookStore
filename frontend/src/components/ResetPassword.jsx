// import { useState, useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Get token from query string
  const token = new URLSearchParams(useLocation().search).get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000); // redirect to login
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid or expired token');
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ResetPassword;
