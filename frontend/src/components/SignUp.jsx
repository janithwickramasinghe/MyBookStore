import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  // const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage(res.data.message || 'Registered successfully.');
      setRegisteredEmail(formData.email); // store for later use
      // navigate('/login'); // redirect to login after registration
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/send-verification-email', {
        email: registeredEmail,
      });
      setMessage(res.data.message || 'Verification email sent.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send verification email.');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name="name" placeholder="Name" onChange={handleChange} required />
        </div>

        <div>
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        </div>

        <div>
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        </div>

        <button type="submit">Register</button>
      </form>

      {/* Show this button only if registration is successful */}
      {registeredEmail && (
        <button style={{ marginTop: '10px' }} onClick={handleSendVerificationEmail}>
          Send Verification Email
        </button>
      )}

      <p>{message}</p>
    </div>
  );
};

export default Signup;
