
const {Endpoint, responseDoc, requestBodyDoc} = require('@brockmeyer-tyler/openapi3');
const {parameters, responses, schemas} = require('../components');
const {token} = require('../constants');


module.exports = [
  new Endpoint(
    'POST', '/list/{listName}/item', 'List', 'Add a new item to the list.',
    'Creates a new item and adds it to the list. Duplicates are allowed.')
    .security(token.name, token.scopes.create)
    .param(parameters.path.listName)
    .body(requestBodyDoc('The item to add to the list', true, schemas.list.item.create))
    .response(200, responseDoc('Successfully added an item to the list.', schemas.list.item.obj))
    .func(req => {

    })
];