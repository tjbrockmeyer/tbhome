
const {OpenApi3, server, tag} = require('@brockmeyer-tyler/openapi3');
const express = require('express');
const {host, port, basePath, apiPath, docsPath, debug} = require('./src/constants');
const components = require('./src/components');
express.Router().get('/', (req, res, next) => {});
const endpoints = require('./src/endpoints');
const middleware = require('./src/middleware');


endpoints.forEach(e => {
  e.response(500, components.responses.error);
  e.response(400, components.responses.badRequest);
  if(e.doc.security.length) {
    e.middleware(middleware.requireAuth(e.doc.security[0]['token'][0]));
    e.response(501, components.responses.unauthenticated);
    e.response(503, components.responses.forbidden);
  }
});
require('@brockmeyer-tyler/ezjwt').config({debug});

const spec = new OpenApi3(
  'Home Network API', 'API for storing data on the home network.', '1.0.0',
  [tag('List', 'Add and remove items from lists')],
  [server(`http://${host}:${port}${basePath}${apiPath}`, 'TB.Home')],
  endpoints, components);

const router = express.Router();
router.use(docsPath, spec.docsRouter);
router.use(apiPath, spec.apiRouter);
router.use(middleware.errorHandler);

const app = express();
app.use(basePath, router);
app.listen(port, host, () => {
  console.log(`UI at: http://${host}:${port}${basePath}${docsPath}`);
});
