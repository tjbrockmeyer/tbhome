
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


if(process.env.NODE_ENV === 'production') {
  host = 'localhost';
  port = 8080;
  liveUrl = process.env.DOMAIN_URL;
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