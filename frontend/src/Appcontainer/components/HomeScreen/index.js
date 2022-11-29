import React from 'react';
import GIF from '../../../data/assets/homepage.gif';

function HomeScreen() {
  return (
    <div style={{ background: 'white', borderRadius: '10px', height: '100%' }}>
      <img src={GIF} style={{ width: '100%', height: '100%' }}></img>
    </div>
  );
}

export default HomeScreen;
