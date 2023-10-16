import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Input,
  Menu,
  message,
  Modal
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import "./app.css";
import ChatList from "./ChatList";
import MessageContainer from "./MessageContainer";
import { MdNotifications } from "react-icons/md";
import logo from "../data/assets/chatter.jpeg";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { fetchDataAndProceed } from "../data/utils/utility";
import { SocketContext } from "../data/SocketContext";
import sound from "../data/assets/notification.mp3";
import { useDispatch } from "react-redux";
import { fetchChatList } from "../data/redux/chat/action";
import HomeScreen from "./components/HomeScreen";
import { IoMdCall } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";

function AppContainer({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerState, setDrawerState] = useState(false);
  const [userList, setUserList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState([]);
  const [newMessageList, setNewMessageList] = useState("");
  const [notification, setNotification] = useState(null);
  const [innerWidth, setinnerWidth] = useState(window.innerWidth);

  const dispatch = useDispatch();

  function playSound() {
    const audio = new Audio(sound);
    console.log(audio);
    audio.play();
  }

  const {
    socket,
    userVideo,
    callAccepted,
    myVideo,
    call,
    callUser,
    answerCall,
    setCall,
    setCallAccepted,
    leaveCall
  } = useContext(SocketContext);

  useEffect(() => {
    socket.on("messageRecieved", (newMessage) => {
      setNewMessageList(newMessage);
      playSound();
    });

    window.addEventListener("resize", () => {
      setinnerWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {}, [call]);

  useEffect(() => {
    if (
      newMessageList &&
      location.pathname.substring(1) == newMessageList.chat._id
    ) {
      setMessage([...message, newMessageList]);
      setNewMessageList("");
    } else if (newMessageList) {
      const menu = (
        <Menu>
          <Menu.Item key="1">
            <div
              onClick={() => {
                navigate(`/${newMessageList.chat._id}`);
                setNotification(null);
              }}
            >
              Message from {newMessageList.sender.name}
            </div>
          </Menu.Item>
        </Menu>
      );

      console.log(newMessageList);
      setNotification(menu);
    }
  }, [newMessageList]);

  console.log(notification);

  const getuserByName = () => {
    fetchDataAndProceed(
      {
        url: "/api/users",
        method: "GET",
        data: { search: keyword }
      },
      (err, res) => {
        console.log(res);
        if (!err && res) {
          setUserList(res?.data);
        }
      }
    );
  };

  const makeoropenChat = (userId) => {
    fetchDataAndProceed(
      {
        url: "/api/chats",
        method: "POST",
        data: { userId }
      },
      (err, res) => {
        console.log(res);
        if (!err && res) {
          setDrawerState(false);
          dispatch(fetchChatList());
          navigate(`/${res.data._id}`);
        }
      }
    );
  };

  const LiveCalling = () => {
    return (
      <>
        <div className="chat-flex chat-flex-jsb">
          <div>
            <video
              className="my-video"
              autoPlay
              ref={myVideo}
              style={{ width: "250px" }}
            ></video>
            <br></br>
            <span>You</span>
          </div>

          {callAccepted && (
            <div>
              <video
                className="user-video"
                autoPlay
                ref={userVideo}
                style={{ width: "250px" }}
              ></video>
              <br></br>
              <span>Friend</span>
            </div>
          )}
        </div>
        <div>
          <Button onClick={leaveCall} type="primary">
            End call
          </Button>
        </div>
      </>
    );
  };

  const renderUserList = () => {
    return (
      <>
        <div className="chat-flex chat-flex-jsb">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search users..."
            style={{ height: "40px", borderRadius: "10px", width: "250px" }}
          ></Input>
          <Button
            onClick={getuserByName}
            style={{ height: "40px", borderRadius: "10px" }}
          >
            Go
          </Button>
        </div>
        <div style={{ marginTop: "20px" }}>
          {userList.map((item) => {
            return (
              <div
                style={{
                  background: "#f9f9f9",
                  padding: "5px",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
                onClick={() => makeoropenChat(item._id)}
                className="chat-flex chat-flex-ac"
              >
                <div>
                  <Avatar src={item.userpic} />
                </div>
                <div style={{ marginLeft: "10px" }}>
                  <div>{item.name}</div>
                  <div style={{ fontSize: "12px" }}>{item.email}</div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const items = [
    {
      key: "1",
      label: <Link to="/profile">My Profile</Link>
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => {
            localStorage.clear();
            navigate("/signin");
          }}
        >
          Logout
        </div>
      )
    }
  ];
  console.log(call);
  return (
    <>
      {call?.isReceivingCall && (
        <div
          style={{
            position: "absolute",
            zIndex: "100",
            background: "white",
            width: "300px",
            height: "60px",
            top: "70px",
            right: "0",
            padding: "5px",
            borderRadius: "5px"
          }}
          className="chat-flex chat-flex-ac"
        >
          <span style={{ fontSize: "16px" }}>
            Call from {call?.from?.user?.name}
          </span>
          <Button
            icon={<IoMdCall color="green" size={26} />}
            type="text"
            onClick={answerCall}
          />
          <Button icon={<IoMdCall color="red" size={26} />} type="text" />
        </div>
      )}

      <div className="app-header">
        <div
          className="chat-flex chat-flex-ac"
          style={{ cursor: "pointer" }}
          onClick={() => setDrawerState(true)}
        >
          <BsSearch />
          <div style={{ marginLeft: "10px" }}>Search users</div>
        </div>

        <div className="chat-flex chat-flex-ac">
          <img src={logo} style={{ width: "150px", marginRight: "50px" }}></img>
          {notification ? (
            <Dropdown trigger={["click"]} overlay={notification}>
              <Button
                icon={<MdNotifications size={26} />}
                type="text"
                style={{ marginRight: "30px", position: "relative" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    background: "red",
                    borderRadius: "50%",
                    display: "inline-block",
                    width: "20px",
                    height: "20px",

                    color: "white"
                  }}
                >
                  {1}
                </div>
              </Button>
            </Dropdown>
          ) : (
            <>
              <Button
                icon={<MdNotifications size={26} />}
                type="text"
                style={{ marginRight: "30px", position: "relative" }}
              ></Button>
            </>
          )}

          <Dropdown
            trigger={["click"]}
            menu={{
              items
            }}
          >
            <Avatar src={user?.userpic} style={{ cursor: "pointer" }}></Avatar>
          </Dropdown>
        </div>
      </div>
      <div className="app">
        {innerWidth > 480 && (
          <div className="app-left">
            <ChatList user={user} />
          </div>
        )}

        <div className="app-right">
          <Routes>
            <Route
              path=""
              element={
                innerWidth <= 480 ? <ChatList user={user} /> : <HomeScreen />
              }
            />
            <Route
              path=":roomid"
              element={
                <MessageContainer
                  user={user}
                  message={message}
                  setMessage={setMessage}
                />
              }
            />
          </Routes>
        </div>
      </div>
      <Modal open={callAccepted} footer={false} width={600}>
        {LiveCalling()}
      </Modal>
      <Drawer
        placement="left"
        open={drawerState}
        title="Search Users"
        onClose={() => setDrawerState(false)}
      >
        {renderUserList()}
      </Drawer>
    </>
  );
}

export default AppContainer;
