import { Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatTile({ data, chatName, selected }) {
  console.log(data);

  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(data._id)}
      className="chat-flex chat-flex-ac"
      style={{
        height: '70px',
        background: selected ? 'rgba(0, 204, 255,0.5)' : '#f9f9f9',
        borderRadius: '5px',

        cursor: 'pointer',
        padding: '5px',
        borderBottom: '1px solid #dbd7d7'
      }}
    >
      <Avatar src={data.isGroupChat ? '' : chatName?.userpic}></Avatar>
      <div style={{ padding: '0px 5px', marginLeft: '20px' }}>
        <span style={{ fontSize: '16px', textTransform: 'capitalize' }}>
          {data.isGroupChat ? data.chatName : chatName.name}
        </span>
        <br></br>
        <span style={{ fontSize: '12px' }}>{data?.latestMessage?.content}</span>
      </div>
    </div>
  );
}

export default ChatTile;
