import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Modal,
  message as Amessage
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import './message.css';
import { BsEmojiSmile } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDataAndProceed, fileToBase64 } from '../../data/utils/utility';
import MessageTile from './MessageTile';
import { SocketContext } from '../../data/SocketContext';
import ScrollableFeed from 'react-scrollable-feed';
import { connect } from 'react-redux';
import { fetchChatData, updateChatState } from '../../data/redux/chat/action';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import EmojiPicker from 'emoji-picker-react';
import { MdCall, MdOutlineCancel } from 'react-icons/md';
import { ImAttachment } from 'react-icons/im';
import Dragger from 'antd/lib/upload/Dragger';
import { AiOutlineUpload } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { BiDotsVerticalRounded } from 'react-icons/bi';

function MessageContainer({
  user,
  message,
  setMessage,
  chatList,
  dispatch,
  selected_chat
}) {
  let timeoutId = '';
  const { socket, callUser } = useContext(SocketContext);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const [modal, setModal] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [groupName, setGroupName] = useState(selected_chat?.chatName);
  const [rename, setRename] = useState(false);
  const [profileModal, setProfileModal] = useState(false);

  const navigate = useNavigate();

  const params = useParams();

  const [content, setContent] = useState('');

  useEffect(() => {
    fetchDataAndProceed(
      {
        url: `/api/message/${params.roomid}`,
        method: 'GET'
      },
      (err, res) => {
        console.log(res);
        if (!err && res.data) {
          setMessage(res.data);
        }
      }
    );

    if (params.roomid && chatList?.length > 0) {
      socket.emit('join chat', params.roomid);
      let selectedchat = [];
      chatList?.forEach((item) => {
        if (item._id == params.roomid) {
          selectedchat = [{ ...item }];
        }
      });
      if (selectedchat) {
        if (selectedchat[0]?.isGroupChat)
          dispatch(updateChatState({ selected_chat: selectedchat[0] }));
        else {
          console.log(user);
          if (selectedchat[0].users[0]._id !== user._id)
            selectedchat[0].chatName = selectedchat[0].users[0].name;
          else selectedchat[0].chatName = selectedchat[0].users[1].name;
          dispatch(updateChatState({ selected_chat: selectedchat[0] }));
        }
      }
    }

    socket.on('typing', () => {
      setIsTyping(true);
      console.log('hello');
    });

    socket.on('stop typing', () => {
      setIsTyping(false);
    });
  }, [chatList, params?.roomid]);

  const typingIndicator = (e) => {
    setContent(e.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit('typing', params.roomid);
    }

    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (typing) {
        socket.emit('stop typing', params.roomid);
        setTyping(false);
      }
    }, 3000);
  };

  const sendMessage = () => {
    fetchDataAndProceed(
      {
        url: '/api/message',
        method: 'POST',
        data: {
          chat: params.roomid,
          content,
          sender: user._id
        }
      },
      (err, res) => {
        if (!err && res) {
          setContent('');

          socket.emit('newMessageSend', res.data);
          setMessage([...message, res.data]);
        }
      }
    );
  };

  const renderProfile = () => {
    if (selected_chat?.users) {
      var userDetails =
        selected_chat?.users[0]._id == user._id
          ? selected_chat?.users[1]
          : selected_chat?.users[0];
    }

    return (
      <div style={{ textAlign: 'center' }}>
        <Avatar
          src={userDetails?.userpic}
          style={{ width: '100px', height: '100px' }}
        />
        <div
          style={{
            marginTop: '20px',
            fontWeight: '500',
            textTransform: 'capitalize'
          }}
        >
          {userDetails?.name}
        </div>
        <div style={{ marginTop: '10px', fontWeight: '500' }}>
          {userDetails?.email}
        </div>
      </div>
    );
  };

  const renameGroup = () => {
    if (!groupName) return Amessage.error('Group name cant be empty');

    fetchDataAndProceed(
      {
        url: '/api/chats/rename',
        method: 'PATCH',
        data: { chatId: params.roomid, chatName: groupName }
      },
      (err, res) => {
        if (!err && res) {
          setRename(false);
          const newChatList = chatList.map((item) => {
            if (item._id == params.roomid) return res.data;
            else return item;
          });
          console.log(newChatList, res.data);
          dispatch(updateChatState({ chat_list: newChatList }));
        }
      }
    );
  };

  const uploadFile = async () => {
    // const file = await fileToBase64(attachment);

    let formData = new FormData();
    formData.append('chatId', params.roomid);
    formData.append('file', attachment);

    fetchDataAndProceed(
      {
        url: '/api/message/uploadfile',
        method: 'POST',
        data: formData,
        content_type: 'multipart/form-data'
      },
      (err, res) => {
        if (!err && res) {
          setModal(false);
          setAttachment(null);
          console.log(res.data);
          socket.emit('newMessageSend', res.data);
          setMessage([...message, res.data]);
        }
      }
    );
  };

  const props = {
    onRemove: (file) => {
      setAttachment([]);
    },

    beforeUpload: (file) => {
      console.log(file);
      if (file.size > 10000000)
        message.error('File size greater than 10 MB not allowed');
      else setAttachment(file);
      return false;
    },
    fileList: !attachment ? [] : [attachment],
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    }
  };

  const renderUploadBox = () => {
    return (
      <>
        <Dragger {...props} style={{ marginTop: '20px' }}>
          <AiOutlineUpload size={30} />

          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </Dragger>
        <div
          className="chat-flex"
          style={{ justifyContent: 'flex-end', marginTop: '20px' }}
        >
          <Button
            style={{ marginRight: '10px' }}
            onClick={() => setModal(false)}
          >
            Cancel
          </Button>
          <Button type="primary" onClick={uploadFile}>
            Upload
          </Button>
        </div>
      </>
    );
  };

  const items = [
    {
      key: '1',
      label: (
        <div
          onClick={() => {
            setRename(true);
            setGroupName(selected_chat?.chatName);
          }}
        >
          Rename Group
        </div>
      )
    },
    {
      key: '2',
      label: <div>Add Members</div>
    },
    {
      key: '3',
      label: <div>Remove Members</div>
    }
  ];

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '10px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="message-header">
        <Button
          icon={<AiOutlineArrowLeft style={{ color: 'white ' }} />}
          type="text"
          onClick={() => navigate('/')}
        />
        {!rename ? (
          <span
            style={{
              fontSize: '18px',
              textTransform: 'capitalize',
              marginLeft: '30px',
              color: 'white'
            }}
          >
            {selected_chat?.chatName}
          </span>
        ) : (
          <>
            <Input
              style={{ background: 'transparent', border: '0', color: 'white' }}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            ></Input>
            <Button
              type="text"
              style={{ color: 'white' }}
              onClick={renameGroup}
            >
              Update
            </Button>
          </>
        )}
        {selected_chat?.isGroupChat ? (
          <Dropdown trigger={['click']} menu={{ items }}>
            <Button
              icon={<BiDotsVerticalRounded color="white" />}
              type="text"
              style={{ marginLeft: 'auto' }}
            />
          </Dropdown>
        ) : (
          <>
            <Button
              style={{ color: 'white', marginLeft: 'auto' }}
              onClick={() => {
                const id =
                  selected_chat?.users[0]._id == user._id
                    ? selected_chat.users[1]._id
                    : selected_chat.users[0]._id;

                callUser(id);
              }}
              type="text"
              icon={<MdCall />}
            ></Button>
            <Button
              icon={<CgProfile color="white" />}
              onClick={() => setProfileModal(true)}
              type="text"
              style={{}}
            />
          </>
        )}
      </div>
      <ScrollableFeed className="message-container">
        {message?.map((item) => {
          const date = new Date(item.createdAt);

          return (
            <MessageTile
              data={item}
              sender={item.sender._id !== user._id}
              time={date.toTimeString()}
              isGroupChat={selected_chat.isGroupChat}
            />
          );
        })}
        {isTyping && <MessageTile sender={true} typing={true} />}
      </ScrollableFeed>
      {emoji && (
        <div>
          <EmojiPicker
            width="100%"
            height={300}
            onEmojiClick={(value) => {
              console.log(value);
              let newMessage = content + value.emoji;
              setContent(newMessage);
            }}
          />
        </div>
      )}

      <div className="message-footer">
        <Button
          icon={emoji ? <MdOutlineCancel /> : <BsEmojiSmile />}
          style={{ height: '40px', width: '50px' }}
          type="text"
          onClick={() => setEmoji(!emoji)}
        />
        <Button
          icon={<ImAttachment />}
          style={{ height: '40px', width: '50px' }}
          type="text"
          onClick={() => setModal(true)}
        />

        <Input.TextArea
          style={{ height: '40px', borderRadius: '20px', resize: 'none' }}
          placeholder="Type your message here..."
          value={content}
          onChange={typingIndicator}
        ></Input.TextArea>

        <Button
          icon={<IoSend />}
          onClick={sendMessage}
          style={{ height: '40px', width: '50px' }}
          type="text"
        ></Button>
      </div>
      <Modal open={modal} onCancel={() => setModal(false)} footer={false}>
        {renderUploadBox()}
      </Modal>
      <Modal
        open={profileModal}
        onCancel={() => setProfileModal(false)}
        footer={false}
      >
        {renderProfile()}
      </Modal>
    </div>
  );
}
const mapstateToProps = (state) => {
  return {
    chatList: state.chat.chat_list,
    selected_chat: state.chat.selected_chat
  };
};

export default connect(mapstateToProps)(MessageContainer);
