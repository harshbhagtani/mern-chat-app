import React, { useState } from 'react';
import { Input, Button, Divider } from 'antd';
import './auth.css';
import Login from './Login';
import Signup from './Signup';

function AuthForm() {
  const [login, setLogin] = useState(true);

  return (
    <div style={{ padding: '20px' }}>
      {login ? <Login setLogin={setLogin} /> : <Signup setLogin={setLogin} />}
    </div>
  );
}

export default AuthForm;
