/**
 * Http service helper file
 *
 *
 */
import axios from "axios";


export const Api = process.env.MIX_APP_API_URL;

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

