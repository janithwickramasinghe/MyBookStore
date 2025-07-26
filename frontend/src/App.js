import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Signup from './components/Login/Signup/Signup.jsx';
import Login from './components/Login/Signup/Login.jsx';
import Home from './components/Login/Signup/Home.jsx';
import ResetPassword from './components/Login/Signup/ResetPassword.jsx';
import ForgotPasswordEmail from './components/Login/Signup/ForgotPasswordEmail.jsx';
import CompleteProfile from './components/Login/Signup/CompleteAddress.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/forgot-password' element={<ForgotPasswordEmail />} />
          <Route path='/complete-profile' element={<CompleteProfile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
