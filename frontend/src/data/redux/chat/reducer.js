import { UPDATE_CHAT_STATE } from './actionTypes';

const initialState = {
  selected_chat: {},
  chat_list: []
};

const chatRoom = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CHAT_STATE: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
};

export default chatRoom;
