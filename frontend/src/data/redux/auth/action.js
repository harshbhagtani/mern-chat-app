import { message } from 'antd';
import { fetchDataAndProceed } from '../../utils/utility';
import { LOGIN_USER } from './actionTypes';
import * as API from './api';

export const loginUser = (data) => {
  return (dispatch) => {
    fetchDataAndProceed(
      {
        url: API.logInApi,
        data,
        method: 'POST'
      },
      (err, res) => {
        if (res.data) {
          localStorage.setItem('token', res.data.token);
          dispatch({ type: LOGIN_USER, payload: res.data.user });
        }
      }
    );
  };
};

export const signupUser = (data) => {
  return (dispatch) => {
    fetchDataAndProceed(
      {
        url: API.signUpApi,
        data,
        method: 'POST'
      },
      (err, res) => {
        if (res.data) {
          localStorage.setItem('token', res.data.token);
          dispatch({ type: LOGIN_USER, payload: res.data.user });
        }
      }
    );
  };
};

export const fetchUserProfile = () => {
  return (dispatch) => {
    fetchDataAndProceed(
      {
        url: API.profileApi,
        method: 'GET'
      },
      (err, res) => {
        if (!err && res) {
          dispatch({ type: LOGIN_USER, payload: res.data });
        } else {
          localStorage.clear();
          message.error('Session expired');
        }
      }
    );
  };
};
