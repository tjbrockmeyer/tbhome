const agent = require('superagent');
const {apiBasePath} = require('./constants');

async function request(method, path, query, body, headers) {
  const req = agent[method](apiBasePath + path);
  if(headers) {
    Object.getOwnPropertyNames(headers).forEach(n => req.set(n, headers[n]))
  }
  if(query) {
    req.query(query)
  }
  if(body) {
    req.send(body)
  }
  const response = await req;
  return response.body;
}


export async function getList(listName) {
  return request('get', `/list`, {listName, includeItems: true});
}

export async function deleteItem(listName, itemName, itemDescription) {
  return request('delete', `/list/${listName}/item`, undefined, {
    name: itemName,
    description: itemDescription,
  })
}

export async function addItem(listName, itemName, itemDescription) {
  return request('post', `/list/${listName}/item`, undefined, {
    name: itemName,
    description: itemDescription,
  })
}