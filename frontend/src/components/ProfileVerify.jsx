// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

// const CompleteProfile = ({ userId }) => {
//   const [form, setForm] = useState({
//     mobile: '',
//     street: '',
//     city: '',
//     postalCode: '',
//     province: ''
//   });

//   const [message, setMessage] = useState('');
//   const location = useLocation();
//   const email = location.state?.email;

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://localhost:5000/api/auth/complete-profile/${userId}`, form);
//       setMessage('Profile updated successfully!');
//     } catch (error) {
//       setMessage('Failed to update profile');
//     }
//   };

//   return (
//     <div>
//       <h2>Complete Your Profile</h2>

//       <div>
//         <form onSubmit={handleSubmit}>
//             <div>
//               <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
//             </div>

//             <div>
//                 <input name="address" placeholder="Address" onChange={handleChange} required />
//             </div>

//             <div>
//                 <input name="city" placeholder="City" onChange={handleChange} required />
//             </div>

//             <div>
//                 <input name="postalCode" placeholder="Postal Code" onChange={handleChange} required />
//             </div>

//             <div>
//                 <input name="province" placeholder="Province" onChange={handleChange} required />
//             </div>
            
//             <button type="submit">Submit</button>
//         </form>
//       </div>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default CompleteProfile;


// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

// const CompleteProfile = () => {
//   const [form, setForm] = useState({
//     mobile: '',
//     street: '',
//     city: '',
//     postalCode: '',
//     province: ''
//   });

//   const [message, setMessage] = useState('');
//   const location = useLocation();
//   const email = location.state?.email;

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email) {
//       setMessage('Email is missing.');
//       return;
//     }

//     try {
//       await axios.put(`http://localhost:5000/api/auth/complete-profile?email=${encodeURIComponent(email)}`, form);
//       setMessage('Profile updated successfully!');
//     } catch (error) {
//       setMessage('Failed to update profile');
//     }
//   };

//   return (
//     <div>
//       <h2>Complete Your Profile</h2>

//       <div>
//         <form onSubmit={handleSubmit}>
//             <div>
//               <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
//             </div>

//             <div>
//                 <input name="street" placeholder="Street" onChange={handleChange} required />
//             </div>

//             <div>
//                 <input name="city" placeholder="City" onChange={handleChange} required />
//             </div>

//             <div>
//                 <input name="postalCode" placeholder="Postal Code" onChange={handleChange} required />
//             </div>

//             <div>
//                 <input name="province" placeholder="Province" onChange={handleChange} required />
//             </div>
            
//             <button type="submit">Submit</button>
//         </form>
//       </div>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default CompleteProfile;


import { useState } from 'react';
// import { useLocation } from 'react-router-dom';
import axios from 'axios';

const CompleteProfile = () => {

  

  const [form, setForm] = useState({
    mobile: '',
    street: '',
    city: '',
    postalCode: '',
    province: ''
  });

  const [message, setMessage] = useState('');
  // const location = useLocation();
  // const email = location.state?.email;
  const email = localStorage.getItem('email'); // ✅ Get email from localStorage


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !email) {
      setMessage('Missing token or email. Please login again.');
      return;
    }

    try {
      await axios.put(
        'http://localhost:5000/api/auth/complete-profile',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage('Profile updated successfully! Verification email sent.');

    } catch (error) {
      setMessage(error.response?.data?.message || `Failed to update profile: token(${token}) or email(${email}) may be invalid.`);
    }
  };

  return (
    <div>
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div><input name="mobile" placeholder="Mobile Number" onChange={handleChange} required /></div>
        <div><input name="street" placeholder="Street" onChange={handleChange} required /></div>
        <div><input name="city" placeholder="City" onChange={handleChange} required /></div>
        <div><input name="postalCode" placeholder="Postal Code" onChange={handleChange} required /></div>
        <div><input name="province" placeholder="Province" onChange={handleChange} required /></div>

        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CompleteProfile;
