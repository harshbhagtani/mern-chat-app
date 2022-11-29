import React, { useEffect, useState } from 'react';
import '../message.css';
import Lottie from 'react-lottie';
import * as animationData from '../../../data/assets/animation.json';
import { Button } from 'antd';
import { FiDownload } from 'react-icons/fi';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

function MessageTile({ sender, data, time, typing, isGroupChat }) {
  const [fileName, setFileName] = useState('');

  const download = (path, filename) => {
    // Create a new link
    const anchor = document.createElement('a');
    anchor.href = path;
    anchor.download = filename;

    // Append to the DOM
    document.body.appendChild(anchor);

    // Trigger `click` event
    anchor.click();

    // Remove element from DOM
    document.body.removeChild(anchor);
  };

  useEffect(() => {
    if (data?.isAttachMent && data?.isAttachMent != 'text') {
      const arr = data?.content?.split('/');
      setFileName(arr[arr.length - 1]);
    }
  }, [data]);

  return (
    <div
      className="chat-flex"
      style={{
        justifyContent: !sender ? 'flex-end' : 'flex-start',
        padding: '0px 20px'
      }}
    >
      <div
        className={sender ? 'message-blue' : 'message-orange'}
        style={{ minHeight: isGroupChat ? '60px' : '50px' }}
      >
        {typing ? (
          <Lottie options={defaultOptions} />
        ) : (
          <>
            {isGroupChat && (
              <span
                style={{
                  fontSize: '10px',
                  position: 'absolute',
                  top: '4px',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}
              >
                {data.sender.name}
              </span>
            )}
            {data?.isAttachMent == 'text' ? (
              <p
                className="message-content"
                style={{ marginTop: isGroupChat ? '10px' : '0px' }}
              >
                {data.content}
              </p>
            ) : (
              <>
                {data?.isAttachMent.includes('image') ? (
                  <img src={data.content} style={{ width: '200px' }}></img>
                ) : (
                  <div>
                    <Button
                      icon={<FiDownload />}
                      type="text"
                      onClick={() => download(data.content, fileName)}
                    />
                    <span>{fileName}</span>
                  </div>
                )}
              </>
            )}

            <div
              className={
                sender ? 'message-timestamp-left' : 'message-timestamp-right'
              }
            >
              {time?.substr(0, 9)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MessageTile;
