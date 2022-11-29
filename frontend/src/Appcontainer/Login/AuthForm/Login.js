import React, { useState } from 'react';
import { Input, Button, Divider, message } from 'antd';
import './auth.css';
import logo from '../../../data/assets/chatter.jpeg';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../data/redux/auth/action';

function Login({ setLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const submitForm = () => {
    if (!email || !password) {
      message.error('Please fill all the fields');
    }

    dispatch(loginUser({ email, password }));
    setEmail('');
    setPassword('');
  };
  return (
    <div>
      <img src={logo} style={{ width: '150px', marginBottom: '20px' }}></img>

      <h1>👋 Hi,Welcome Back</h1>
      <form>
        <div className="auth-form-item">
          <label style={{ fontWeight: 600 }}>Email</label>
          <Input
            placeholder="john@email.com"
            style={{ height: '40px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
        </div>

        <div className="auth-form-item">
          <label style={{ fontWeight: 600 }}>Password</label>
          <Input.Password
            placeholder="8+ Character strong password"
            style={{ height: '40px' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input.Password>
        </div>

        <Button
          type="primary"
          style={{ width: '100%', height: '40px' }}
          className="auth-form-item"
          onClick={submitForm}
        >
          Login
        </Button>
      </form>
      <Divider></Divider>
      <p style={{ marginLeft: '20%' }}>
        Don't have an account?{' '}
        <span
          onClick={() => setLogin(false)}
          style={{ cursor: 'pointer', color: '#1890ff' }}
        >
          Sign-up
        </span>
      </p>
    </div>
  );
}

export default Login;
