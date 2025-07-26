import { useState } from 'react';
import axios from 'axios';

const CompleteProfile = ({ userId }) => {
  const [form, setForm] = useState({
    mobile: '',
    street: '',
    city: '',
    postalCode: '',
    province: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/auth/complete-profile/${userId}`, form);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div>
      <h2>Complete Your Profile</h2>

      <div>
        <form onSubmit={handleSubmit}>
            <div>
              <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
            </div>

            <div>
                <input name="address" placeholder="Address" onChange={handleChange} required />
            </div>

            <div>
                <input name="city" placeholder="City" onChange={handleChange} required />
            </div>

            <div>
                <input name="postalCode" placeholder="Postal Code" onChange={handleChange} required />
            </div>

            <div>
                <input name="province" placeholder="Province" onChange={handleChange} required />
            </div>
            
            <button type="submit">Submit</button>
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CompleteProfile;
