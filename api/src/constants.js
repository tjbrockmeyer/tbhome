
let
  host = 'localhost',
  port = 3001,
  basePath = '/api',
  apiPath = '/call',
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
  host = 'tb.home';
  port = 80;
  debug = false;
}


module.exports = {
  host,
  port,
  basePath,
  apiPath,
  docsPath,
  debug,
  token,
};