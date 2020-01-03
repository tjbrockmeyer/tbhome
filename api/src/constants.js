
let
  host = 'localhost',
  port = 3001,
  liveUrl = 'http://localhost:3001',
  basePath = '/api',
  apiPath = '/',
  docsPath = '/docs',
  debug = true,
  token = {
    name: 'token',
    scopes: {
      create: 'CREATE',
      delete: 'DELETE',
    }
  };


if(process.env.ENV === 'live') {
  host = 'localhost';
  port = 8080;
  liveUrl = 'https://tbhome.haiskai.blue';
  debug = false;
}


module.exports = {
  host,
  port,
  liveUrl,
  basePath,
  apiPath,
  docsPath,
  debug,
  token,
};