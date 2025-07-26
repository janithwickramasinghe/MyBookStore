import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      setMessage(res.data.message);
      navigate('/home');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed.');
    }
  };

  // Forgot password button handler
  const handleForgotEmail = (event) => {
    event.preventDefault();
    // Navigate to forgot password page
    navigate('/forgot-password');
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        </div>

        <div>
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        </div>

        <button type="submit">Login</button>

        {/* forgot password button */}
        <button onClick={handleForgotEmail}>Forgot Password</button>


      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
