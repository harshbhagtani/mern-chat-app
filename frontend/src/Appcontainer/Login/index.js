import React from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AuthForm from './AuthForm';
import './login.css';
import ViewApp from './ViewApp';

function Login({ user }) {
  console.log(user);
  if (user && localStorage.getItem('token')) return <Navigate to="/" />;
  return (
    <div style={{ display: 'flex' }}>
      <div className="login-left">
        <AuthForm />
      </div>
      <div className="login-right">
        <ViewApp />
      </div>
    </div>
  );
}

function mapstateToProps(state) {
  return {
    user: state.auth.user
  };
}

export default connect(mapstateToProps)(Login);
