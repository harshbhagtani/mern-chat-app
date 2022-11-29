import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import AppContainer from './Appcontainer';
import ProtectedRoute from './Appcontainer/components/ProtectedRoute';
import Login from './Appcontainer/Login';
import Profile from './Appcontainer/Profile';
import { fetchUserProfile } from './data/redux/auth/action';

function App({ user, dispatch }) {
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/*" element={<AppContainer user={user} />}></Route>
        </Route>
      </Routes>
    </div>
  );
}
function mapstateToProps(state) {
  return {
    user: state.auth.user
  };
}

export default connect(mapstateToProps)(App);
