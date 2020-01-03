
let
  host = 'localhost',
  port = 3001,
  basePath = '/api',
  apiPath = '/rest',
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
  host = 'tbhome.haiskai.blue';
  port = 443;
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