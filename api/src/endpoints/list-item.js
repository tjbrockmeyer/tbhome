
const {Endpoint, Response, responseDoc, requestBodyDoc} = require('@brockmeyer-tyler/openapi3');
const {parameters, responses, schemas} = require('../components');
const {token} = require('../constants');
const queries = require('../queries');


module.exports = [
  new Endpoint(
    'POST', '/list/{listName}/item', 'List', 'Add a new item to the list.',
    'Creates a new item and adds it to the list. Duplicates are allowed.')
    //.security(token.name, token.scopes.create)
    .param(parameters.path.listName)
    .body(requestBodyDoc('The item to add to the list', true, schemas.list.item.obj))
    .response(200, responseDoc('Successfully added an item to the list.'))
    .response(404, responseDoc('Aint no list like dat'))
    .func(async req => {
      const listName = req.params.listName;

      const result = await queries.getActiveListID(listName);
      if (result.rows.length === 0) {
        return new Response(404)
      }

      const id = result.rows[0].id;
      const name = req.body.name;
      const description = req.body.description;

      await queries.createListItem(id, name, description);
    }),

  new Endpoint(
    'DELETE', '/list/{listName}/item', 'List', 'Delete an item from a list',
    'Delete an item from a particular list, defined by the combination of its name and description')
    .param(parameters.path.listName)
    .body(requestBodyDoc('The item to be deleted from the list', true, schemas.list.item.obj))
    .response(200, responseDoc('Item successfully deleted, or it did not exist'))
    .response(404, responseDoc('The list did not exist'))
    .func(async req => {
      const listName = req.params.listName;

      const result = await queries.getActiveListID(listName);
      if(result.rows.length === 0) {
        return new Response(404);
      }

      const id = result.rows[0].id;
      const name = req.body.name;
      const description = req.body.description;

      await queries.deleteItemFromList(id, name, description);
    })
];