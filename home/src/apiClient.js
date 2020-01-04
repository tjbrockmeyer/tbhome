const agent = require('superagent');
const {apiBasePath} = require('./constants');

async function request(method, path, query, body, headers) {
  console.log(apiBasePath, path, query, body, headers);
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
  return await req;
}


export async function getList(listName) {
  return request('get', `/list/${listName}`);
}

export async function deleteItem(listName, itemName) {
  return request('delete', `/list/${listName}/item/${itemName}`)
}

export async function addItem(listName, itemName, itemDescription) {
  return request('post', `/list/${listName}/item/${itemName}`, undefined, {
    description: itemDescription,
  })
}

export async function clearList(listName) {
  return request('delete', `/list/${listName}/items`);
}