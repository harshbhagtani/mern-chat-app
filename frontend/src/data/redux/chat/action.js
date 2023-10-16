import { fetchDataAndProceed } from "../../utils/utility";
import { UPDATE_CHAT_STATE } from "./actionTypes";

export const updateChatState = (payload) => {
  return {
    type: UPDATE_CHAT_STATE,
    payload
  };
};

export const fetchChatList = () => {
  return (dispatch) => {
    fetchDataAndProceed(
      {
        url: `/api/chats`,
        method: "GET"
      },
      (err, res) => {
        if (!err && res) {
          dispatch(updateChatState({ chat_list: res.data }));
        }
      }
    );
  };
};

export const fetchChatData = (id) => {
  return (dispatch) => {
    fetchDataAndProceed(
      {
        url: `/api/chats/${id}`,
        method: "GET"
      },
      (err, res) => {
        if (!err && res) {
          dispatch(updateChatState({ selected_chat: res.data }));
        }
      }
    );
  };
};
