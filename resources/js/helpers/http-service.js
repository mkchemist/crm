/**
 * Http service helper file
 *
 *
 */
import axios from "axios";


export const Api = document.getElementById('APP_API_URL').value;

export const Token = document.getElementById('token').value;

const generateApiUrl = (path,query = {}) => {
  let q = {};
  for(let key in query) {
    if(query[key]) {
      q[key] = query[key];
    }
  }
  let queryString = Object.keys(q).map(key => `${key}=${q[key]}`).join('&');
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



export const UrlHelper = {
  base: function () {
    let base = document.getElementById('APP_API_URL');
      base = base.value.replace('api/', '');
      return base;
  },
  generate: function(url="") {
    return this.base()+url;
  }
}


export const asyncDataFlow = (data, cb) => {
  let promise = () => Promise.resolve(data);

  promise().then((data) => cb(data));
}
