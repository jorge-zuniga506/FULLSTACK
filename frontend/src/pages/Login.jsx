import React from 'react';
import AuthContainer from '../components/Auth/AuthContainer';

function Login() {
  return (
    <AuthContainer initialMode="signin" />
  );
}

export default Login;