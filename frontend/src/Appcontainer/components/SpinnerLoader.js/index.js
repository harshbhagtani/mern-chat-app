import { Spin } from 'antd';
import React from 'react';

function SpinnerLoader({ text = 'Loading...', opacity = '0.5' }) {
  return (
    <div
      className="chat-flex chat-flex-ac"
      style={{
        width: '100%',
        height: '100%',
        zIndex: '100',
        position: 'absolute',
        top: '0',
        justifyContent: 'center',
        opacity
      }}
    >
      <div>
        <Spin />
        <span>{text}</span>
      </div>
    </div>
  );
}

export default SpinnerLoader;
