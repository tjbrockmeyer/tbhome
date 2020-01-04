
const {Endpoint, Response, responseDoc, requestBodyDoc, parameterDoc} = require('@brockmeyer-tyler/openapi3');
const {parameters, responses, schemas} = require('../components');
const {token} = require('../constants');
const queries = require('../queries');

module.exports = [
  new Endpoint(
    'POST', '/list/{listName}', 'List', 'Create a list', 'Create a new list.')
    //.security(token.name, token.scopes.create)
    .param(parameters.path.listName)
    .body(requestBodyDoc('the description of the list', false, schemas.list.createDetails))
    .response(200, responseDoc('Successfully created the list'))
    .response(409, responseDoc('That list already exists'))
    .func(async req => {
      const name = req.params.listName;
      const description = req.body.description;
      await queries.createList(name, description);
    }),

  new Endpoint(
    'GET', '/list/{listName}', 'List', 'View a list',
    'Retrieve a list and all of its contents.')
    // .security(token.name)
    .param(parameters.path.listName)
    .response(200, responseDoc('List found', schemas.list.obj))
    .response(204, responseDoc('No list could be found'))
    .func(async req => {
      const {listName} = req.params;
      const result = await queries.getList(listName);
      if(!result.rows.length) {
        return new Response(204);
      }
      const list = result.rows[0].json;
      if (list.items.length === 1 && list.items[0].name === null) {
        list.items = [];
      }
      return list;
    }),
];