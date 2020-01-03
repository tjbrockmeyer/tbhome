
const {OpenApi3, server, tag} = require('@brockmeyer-tyler/openapi3');
const express = require('express');
const cors = require('cors');
const {host, port, liveUrl, basePath, docsPath, apiPath, debug, token} = require('./src/constants');
const components = require('./src/components');
const endpoints = require('./src/endpoints');
const middleware = require('./src/middleware');
const {initQueries, start} = require('@brockmeyer-tyler/psql-client');
const queries = require('./src/queries');


start('192.168.0.6', 5432, 'postgres', 'psql123', 'home', {logLevel: 1});
initQueries(queries);
endpoints.forEach(e => {
  e.response(400, components.responses.badRequest);
  e.onResponse(middleware.errorResponseHandler);
  if(e.doc.security.length) {
    const scopes = e.doc.security[0][token.name];
    e.middleware(middleware.requireAuth(scopes));
  }
});
require('@brockmeyer-tyler/ezjwt').config({debug});

const spec = new OpenApi3(
  'Home Network API', 'API for storing data on the home network.', '1.0.0',
  [tag('List', 'Add and remove items from lists')],
  [server(liveUrl+basePath, 'tbhome')],
  endpoints, components);

const router = express.Router();
router.get('/', (req, res) => res.redirect(301, basePath+docsPath));
router.use(docsPath, spec.docsRouter);
router.use(apiPath, spec.apiRouter);
router.use(middleware.errorHandler);

const app = express();
app.use(cors());
app.use(basePath, router);
app.listen(port, host, () => {
  console.log(`UI at: ${liveUrl}${basePath}${docsPath}`);
});
