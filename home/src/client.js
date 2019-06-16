import agent from 'superagent';
import {apiBasePath} from './constants';


async function backendRequest(method, endpoint, {queryParams, body, headers}={}) {
  if(queryParams) {
    endpoint += '?' + Object.getOwnPropertyNames(queryParams).map(n => `${n}=${queryParams[n]}`).join('&');
  }
  const r = agent[method.toLowerCase()](apiBasePath + endpoint);
  if(body) {
    r.send(body);
  }
  if(headers) {
    Object.getOwnPropertyNames(headers).forEach(n => r.set(n, headers[n]));
  }
  const response = await r;
  return response.body;
}


export function addToList(listName, item) {
  return backendRequest('POST', `/list/${listName}`, {body: item});
}

export function getList(listName) {
  return backendRequest('GET', `/list/${listName}`);
}
