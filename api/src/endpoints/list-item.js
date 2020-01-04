
const {Endpoint, Response, responseDoc, requestBodyDoc} = require('@brockmeyer-tyler/openapi3');
const {parameters, responses, schemas} = require('../components');
const {token} = require('../constants');
const queries = require('../queries');


module.exports = [
  new Endpoint(
    'POST', '/list/{listName}/item/{itemName}', 'List', 'Add a new item to the list.',
    'Creates a new item and adds it to the list. Duplicate names are not allowed.')
    //.security(token.name, token.scopes.create)
    .param(parameters.path.listName)
    .param(parameters.path.itemName)
    .body(requestBodyDoc('The item to add to the list', true, schemas.list.item.createDetails))
    .response(201, responseDoc('Successfully added an item to the list.'))
    .response(409, responseDoc('An item with that name already exists'))
    .func(async req => {
      const {listName, itemName} = req.params;
      const description = req.body.description;
      await queries.createListItem(listName, itemName, description);
      return new Response(201);
    }),

  new Endpoint(
    'DELETE', '/list/{listName}/item/{itemName}', 'List', 'Delete an item from a list',
    'Delete an item from a particular list by name.')
    .param(parameters.path.listName)
    .param(parameters.path.itemName)
    .response(204, responseDoc('Item successfully deleted.'))
    .response(403, responseDoc('Unable to delete the item. Either the list or item does not exist, or permission was denied.'))
    .func(async req => {
      const {listName, itemName} = req.params;
      const result = await queries.deleteItemFromList(listName, itemName);
      if(result.rowCount === 0) {
        return new Response(403);
      }
      return new Response(204);
    }),

  new Endpoint(
    'DELETE', '/list/{listName}/items', 'List', 'Clear all items from a list',
    'Delete every item from a particular list.')
    .param(parameters.path.listName)
    .response(204, responseDoc('Items successfully deleted.'))
    .response(403, responseDoc('Unable to delete items from the list. Either the list does not exist, it is already empty, or permission was denied.'))
    .func(async req => {
      const {listName} = req.params;
      const result = await queries.clearList(listName);
      if(result.rowCount === 0) {
        return new Response(403);
      }
      return new Response(204);
    })
];