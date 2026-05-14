import React from 'react';
import LandPageNavbar from '../components/landpage/LandPageNavbar';
import LandPageLogin from '../components/landpage/LandPageLogin';
import LandPageFooter from '../components/landpage/LandPageFooter';
import '../styles/LandPage.css';

function Login() {
  return (
    <div className="startup-theme">
      <LandPageNavbar />
      <LandPageLogin />
      <LandPageFooter />
    </div>
  );
}

export default Login;