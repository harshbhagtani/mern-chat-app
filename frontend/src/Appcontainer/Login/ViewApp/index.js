import React from 'react';
import logo from '../../../data/assets/chatter.jpeg';
import ReactTypingEffect from 'react-typing-effect';
import { Carousel } from 'antd';
import img1 from '../../../data/assets/img1.png';
import img2 from '../../../data/assets/img2.png';
import img3 from '../../../data/assets/img3.png';

function ViewApp() {
  const data = [
    '👋 Hello welcome to the most amazing chat app on the Internet',
    'Connect with your friends and family bu just making an account with our cool app',
    'Securely chat with your Closed ones 👨‍👩‍👧‍👧 ',
    'Make video calls 📞  with your far-away friends with a click of a button '
  ];

  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <img src={logo} style={{ width: '200px' }}></img>
      </div>
      <div
        style={{ marginTop: '100px', textAlign: 'center', fontSize: '18px' }}
      >
        <ReactTypingEffect
          text={data}
          speed={50}
          eraseSpeed={50}
          typingDelay={100}
        />
      </div>
      <div
        className="chat-flex"
        style={{ justifyContent: 'center', marginTop: '30px' }}
      >
        <Carousel autoplay={true} style={{ width: '600px' }}>
          <div>
            <img src={img1} style={{ width: '600px' }}></img>
          </div>
          <div>
            <img src={img2} style={{ width: '600px' }}></img>
          </div>
          <div>
            <img src={img3} style={{ width: '600px' }}></img>
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default ViewApp;
