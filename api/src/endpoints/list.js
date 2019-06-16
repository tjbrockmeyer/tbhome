
const {Endpoint} = require('@brockmeyer-tyler/openapi3');
const {requestBodies, parameters, responses} = require('../components');
const {requireAuth} = require('../middleware');
const {scopes} = require('../constants');


module.exports = [
  new Endpoint(
    'POST', '/list/{listName}', 'List', 'Create a list', 'Create a new list.')
    .middleware(requireAuth(scopes.create))
    .security('token', scopes.create)
    .param(parameters.path.listName)
    .response(200, responses.list.created)
    .func(async req => {

    }),

  new Endpoint(
    'GET', '/list/{listName}', 'List', 'Retrieve a list for viewing',
    'Retrieve a list and all of its contents.')
    .param(parameters.path.listName)
    .response(200, responses.list.obj)
    .func(req => {

    })
];