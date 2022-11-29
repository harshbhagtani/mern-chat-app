import axios from 'axios';

const getHeaders = (content_type) => {
  let headers = { 'Content-Type': content_type };
  headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');

  return headers;
};

export const fetchDataAndProceed = (
  { data = {}, timeout, method, url, content_type = 'application/json' },
  callback
) => {
  const baseURL = 'http://localhost:3001';

  let params = {};
  let payload = {};

  if (method === 'GET') {
    params = { ...data };
  } else {
    payload = { ...data };
  }

  console.log(payload, data);

  axios({
    url,
    method,
    baseURL,
    timeout,
    headers: getHeaders(content_type),
    data: content_type == 'multipart/form-data' ? data : payload,
    params
  })
    .then((res) => {
      callback(null, res);
    })
    .catch((err) => {
      callback(err, null);
    });
};

export const fileToBase64 = (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = function () {
      resolve(reader.result);
    };

    reader.readAsDataURL(file);
  });
};
