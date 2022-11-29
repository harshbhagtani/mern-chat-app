import React from 'react';
import { connect } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import SpinnerLoader from './SpinnerLoader.js';

function ProtectedRoute({ user }) {
  // console.log(!user, 'sdsd');
  if (localStorage.getItem('token') && !user) return <SpinnerLoader />;
  if (!localStorage.getItem('token') || !user) return <Navigate to="/signin" />;
  return <Outlet />;
}

function mapstateToProps(state) {
  return {
    user: state.auth.user
  };
}

export default connect(mapstateToProps)(ProtectedRoute);
