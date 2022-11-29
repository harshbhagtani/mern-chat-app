import { Avatar, Button, Input } from 'antd';
import React, { useState } from 'react';

function Profile({ user }) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div
      style={{
        background: '#f9f9f9',
        justifyContent: 'center',
        height: '100vh'
      }}
      className="chat-flex chat-flex-ac"
    >
      <div
        style={{
          background: 'white',
          width: '500px',
          padding: '20px',
          borderRadius: '20px'
        }}
      >
        <Avatar
          src={user?.userpic}
          style={{ width: '100px', height: '100px', marginLeft: '180px' }}
        />
        <div>
          {' '}
          <label>Name</label>
          <br></br>
          <Input
            style={{ borderRadius: '10px', height: '40px' }}
            value={name}
            disabled={!edit}
            onChange={(e) => setName(e.target.value)}
          ></Input>
        </div>
        <div>
          <label>Email</label>
          <br></br>
          <Input
            style={{ borderRadius: '10px', height: '40px' }}
            value={email}
            disabled={!edit}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
        </div>
        {edit && (
          <>
            <div>
              <label>Password</label>
              <br></br>
              <Input style={{ borderRadius: '10px', height: '40px' }}></Input>
            </div>
            <div>
              <label>Password</label>
              <br></br>
              <Input style={{ borderRadius: '10px', height: '40px' }}></Input>
            </div>
          </>
        )}
        {edit ? (
          <Button
            style={{ marginTop: '20px' }}
            onClick={() => {
              setEdit(false);
              setName(user.name);
              setEmail(user.email);
              setPassword('');
              setConfirmPassword('');
            }}
          >
            Cancel
          </Button>
        ) : (
          <Button
            onClick={() => setEdit(true)}
            type="primary"
            style={{ marginTop: '20px' }}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}

export default Profile;
