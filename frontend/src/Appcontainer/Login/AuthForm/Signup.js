import React, { useState } from 'react';
import { Input, Button, Divider, message } from 'antd';
import './auth.css';
import logo from '../../../data/assets/chatter.jpeg';
import { useDispatch } from 'react-redux';
import { signupUser } from '../../../data/redux/auth/action';

function Signup({ setLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const authSignup = () => {
    if (!password || !name || !email)
      return message.error('Please fill all the fields');
    if (password !== confirmPassword)
      return message.error('Password dont match');
    const payload = {
      email,
      password,
      name
    };
    dispatch(signupUser(payload));
  };

  return (
    <div>
      <img src={logo} style={{ width: '150px', marginBottom: '20px' }}></img>

      <h1>👋 Hi,Welcome </h1>
      <h3>Signup fast 😎 and connect with your friends</h3>
      <form>
        <div className="auth-form-item">
          <label style={{ fontWeight: 600 }}>Name </label>
          <Input
            placeholder="Your name"
            style={{ height: '40px' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Input>
        </div>
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
        <div className="auth-form-item">
          <label style={{ fontWeight: 600 }}>Confirm password</label>
          <Input.Password
            placeholder="8+ Character strong password"
            style={{ height: '40px' }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Input.Password>
        </div>

        <Button
          type="primary"
          style={{ width: '100%', height: '40px' }}
          className="auth-form-item"
          onClick={authSignup}
        >
          Sign-up
        </Button>
      </form>

      <Divider></Divider>
      <p style={{ marginLeft: '20%' }}>
        Already have an account?{' '}
        <span
          onClick={() => setLogin(true)}
          style={{ cursor: 'pointer', color: '#1890ff' }}
        >
          Sign-in
        </span>
      </p>
    </div>
  );
}

export default Signup;
