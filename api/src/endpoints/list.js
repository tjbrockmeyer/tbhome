
const {Endpoint, responseDoc} = require('@brockmeyer-tyler/openapi3');
const {parameters, responses, schemas} = require('../components');
const {token} = require('../constants');


module.exports = [
  new Endpoint(
    'POST', '/list/{listName}', 'List', 'Create a list', 'Create a new list.')
    .security(token.name, token.scopes.create)
    .param(parameters.path.listName)
    .response(200, responseDoc('Successfully created the list'))
    .response(409, responseDoc('That list already exists'))
    .func(async req => {

    }),

  new Endpoint(
    'GET', '/list/{listName}', 'List', 'Retrieve a list for viewing',
    'Retrieve a list and all of its contents.')
    .security(token.name)
    .param(parameters.path.listName)
    .response(200, responseDoc('List found', schemas.list.obj))
    .func(req => {

    }),

  new Endpoint(
    'DELETE', '/list/{listName}', 'List', 'Delete an existing list',
    'Delete a list and all of the items on it - permanently.')
    .security(token.name, token.scopes.delete)
    .param(parameters.path.listName)
    .response(200, responseDoc('Successfully deleted the list'))
    .func(req => {

    })
];