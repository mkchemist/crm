/**
 * Http service helper file
 *
 *
 */
import axios from "axios";


export const Api = document.getElementById('APP_API_URL').value;

export const Token = document.getElementById('token').value;

const generateApiUrl = (path,query = {}) => {
  let queryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
  return Api+path+'?api_token='+Token+'&'+queryString;
}

export const httpCall = {};


axios

httpCall.get = (path,query) => {
  return axios.get(generateApiUrl(path, query))
}

httpCall.post = (path, data) => {
  data = new URLSearchParams(data);
  return axios.post(generateApiUrl(path),data);
}

