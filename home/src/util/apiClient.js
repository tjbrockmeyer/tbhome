const agent = require('superagent');
const {apiBasePath} = require('../constants');


async function request(method, url, query, body, headers) {
  if(Object.keys(query).length) {
    url += '?' + Object.getOwnPropertyNames(query).map(n => `${n}=${query[n]}`).join('&')
  }
  const req = agent[method](url);
  if(body) {
    req.send(body)
  }
  if(headers) {
    Object.getOwnPropertyNames(headers).forEach(n => req.set(n, headers[n]))
  }
  const response = await req;
  return response.body;
}


export async function getList(title) {
  return request('get', apiBasePath + `/list/${title}`);
}