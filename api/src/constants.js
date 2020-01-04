
require('dotenv').config();

let
  host = process.env.API_HOST,
  port = process.env.API_PORT,
  liveUrl = process.env.DOMAIN_URL,

  dbHost = process.env.PG_HOST,
  dbPort = process.env.PG_PORT,
  dbUser = process.env.PG_USER,
  dbPass = process.env.PG_PASS,
  dbName = process.env.PG_NAME,

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
  dbHost,
  dbPort,
  dbUser,
  dbPass,
  dbName
};