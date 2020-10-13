/**
 * Http service helper file
 *
 *
 */
import axios from "axios";


export const Api = document.getElementById('APP_API_URL').value;

export const Token = document.getElementById('token').value;

const generateApiUrl = (path) => {

  return Api+path+'?api_token='+Token;
}

export const httpCall = {};


httpCall.get = (path) => {
  return axios.get(generateApiUrl(path));
}

httpCall.post = (path, data) => {
  data = new URLSearchParams(data);
  return axios.post(generateApiUrl(path),data);
}

