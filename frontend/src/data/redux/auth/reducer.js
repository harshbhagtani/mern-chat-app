import { LOGIN_USER } from './actionTypes';

const initialState = {
  user: null,
  loggedin: false,
  error: null
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER: {
      return {
        ...state,
        user: action.payload,
        loggedin: true
      };
    }
    default:
      return state;
  }
}
