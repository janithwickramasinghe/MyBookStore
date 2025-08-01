import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Home from './components/Home';
import Signup from './components/SignUp';
import Login from './components/SignIn';
import ForgotPasswordEmail from './components/ForgotPassword';
import CompleteProfile from './components/ProfileVerify';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPasswordEmail />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
