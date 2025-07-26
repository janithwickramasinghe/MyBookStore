import React from 'react'
import axios from 'axios';

const ForgotPasswordEmail = () => {

    const [ email, setEmail ] = React.useState('');
    const [ message, setMessage ] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (error) {
            setMessage('Error sending email. Please try again later.');
        }
    };

return (
    <div>
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <button type="submit">Send Reset Link</button>
            </form>
        </div>
        <p>{message}</p>
    </div>
);
}

export default ForgotPasswordEmail;