import { Avatar, Button, Input, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { REACT_APP_BASE_URL } from "../../data/config";
import { fetchDataAndProceed } from "../../data/utils/utility";
import ChatTile from "./ChatTile";
import { MdOutlineGroupAdd } from "react-icons/md";
import { connect } from "react-redux";
import { fetchChatList } from "../../data/redux/chat/action";

function ChatList({ user, chatList, dispatch, selectedChat }) {
  const [modalState, setModalState] = useState(false);
  const [userList, setUserList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);

  const modalClose = () => {
    setModalState(false);
    setGroupMembers([]);
    setGroupName("");
  };

  const [search, setSearch] = useState("");
  useEffect(() => {
    dispatch(fetchChatList());
  }, []);

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
  // console.log(userList);

  const CreateGroupChat = () => {
    if (groupMembers.length <= 1) {
      return message.error("Please select atleast 2 group Members");
    }
    if (!groupName) {
      return message.error("Enter a group name");
    }
    const payload = {
      name: groupName,
      users: groupMembers
    };

    fetchDataAndProceed(
      {
        url: "/api/chats/group",
        data: payload,
        method: "POST"
      },
      (err, res) => {
        if (!err && res) {
          console.log(res);
        }
      }
    );
  };

  const renderCreateGroupChat = () => {
    return (
      <>
        <div>
          <label style={{ fontWeight: "600" }}>Group Name</label>
          <Input
            placeholder="Type your group name..."
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
            style={{ borderRadius: "10px", height: "40px" }}
          ></Input>
        </div>

        <div style={{ marginTop: "20px", fontWeight: "600" }}>Add Members</div>
        <div className="chat-flex">
          <Input
            placeholder="Search users..."
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            style={{ borderRadius: "10px", height: "40px", width: "300px" }}
          ></Input>
          <Button
            onClick={getuserByName}
            style={{ borderRadius: "10px", height: "40px", marginLeft: "10px" }}
          >
            Go
          </Button>
        </div>
        <div>{groupMembers.length} Members added</div>

        <div>
          {userList?.map((item) => {
            const inc = groupMembers.includes(item._id);
            return (
              <div
                className="chat-flex chat-flex-ac"
                style={{
                  background: inc ? "rgba(0, 204, 255, 0.5)" : "#f9f9f9",
                  width: "300px",
                  cursor: "pointer",
                  borderRadius: "10px",
                  marginTop: "5px"
                }}
                onClick={() => {
                  if (inc) {
                    setGroupMembers(
                      groupMembers.filter((user) => user == item.id)
                    );
                  } else setGroupMembers([...groupMembers, item._id]);
                }}
              >
                <Avatar src={item.userpic} />
                <div style={{ marginLeft: "10px" }}>
                  <span>{item.name}</span>
                  <br></br>
                  <span>{item.email}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="chat-flex" style={{ justifyContent: "flex-end" }}>
          <Button
            style={{
              height: "40px",
              borderRadius: "10px",
              marginRight: "10px"
            }}
            onClick={modalClose}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            style={{ height: "40px", borderRadius: "10px" }}
            onClick={CreateGroupChat}
          >
            Create
          </Button>
        </div>
      </>
    );
  };

  return (
    <div
      style={{
        background: "white",
        height: "100%",
        width: "100%",
        borderRadius: "10px",
        padding: "15px"
      }}
    >
      <div className="chat-flex">
        <Input
          placeholder="Search chat..."
          style={{ height: "40px", borderRadius: "20px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></Input>
        <Button
          icon={<MdOutlineGroupAdd size={20} />}
          type="text"
          title="Group chat"
          style={{ height: "40px", borderRadius: "50%", width: "40px" }}
          onClick={() => setModalState(true)}
        ></Button>
      </div>
      <div
        style={{
          marginTop: "20px",
          height: "calc(100% - 80px)",
          overflow: "scroll"
        }}
      >
        {chatList
          .filter((item) => {
            let chatName = item.chatName;

            if (!item?.isGroupChat) {
              if (item.users[0]._id !== user._id) chatName = item.users[0];
              else chatName = item.users[1];

              const check = chatName.name.toLowerCase().includes(search);
              return check;
            } else {
              const check = chatName.toLowerCase().includes(search);
              return check;
            }
          })
          .map((item) => {
            let chatName = item.chatName;

            if (!item?.isGroupChat) {
              if (item.users[0]._id !== user._id) chatName = item.users[0];
              else chatName = item.users[1];
            }
            return (
              <ChatTile
                data={item}
                chatName={chatName}
                selected={selectedChat._id == item._id}
              />
            );
          })}
      </div>
      <Modal
        open={modalState}
        footer={false}
        onCancel={modalClose}
        title="Create a group Chat"
      >
        {renderCreateGroupChat()}
      </Modal>
    </div>
  );
}

const mapstateToProps = (state) => {
  return {
    chatList: state.chat.chat_list,
    selectedChat: state.chat.selected_chat
  };
};

export default connect(mapstateToProps)(ChatList);
