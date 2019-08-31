
const {Endpoint, Response, responseDoc, requestBodyDoc, parameterDoc} = require('@brockmeyer-tyler/openapi3');
const {parameters, responses, schemas} = require('../components');
const {token} = require('../constants');
const queries = require('../queries');


function convertLists(rows) {
  const zeroDate = new Date(0, 0, 0, 0, 0, 0, 1);
  return rows.map(l => ({
    id: l.id,
    name: l.name,
    closeDate: l.close_date < zeroDate ? undefined : l.close_date,
    description: l.description,
  }));
}

function convertItem(row) {
  return {
    name: row.item_name,
    description: row.item_description,
  }
}

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}


module.exports = [
  new Endpoint(
    'POST', '/list/{listName}', 'List', 'Create a list', 'Create a new list.')
    //.security(token.name, token.scopes.create)
    .param(parameters.path.listName)
    .body(requestBodyDoc('the description of the list', false, schemas.list.create))
    .response(200, responseDoc('Successfully created the list'))
    .response(409, responseDoc('That list already exists'))
    .func(async req => {
      const name = req.params.listName;
      const description = req.body.description;
      await queries.createList(name, description);
    }),

  new Endpoint(
    'GET', '/list', 'List', 'View all lists, or filter them down',
    'Retrieve a list and all of its contents.')
    // .security(token.name)
    .param(parameterDoc('listName', 'query', 'The name of the list', false, {type: 'string'}))
    .param(parameterDoc('date', 'query', 'The date of the list (used for retrieving closed lists)', false, {type: 'string', format: 'dateTime'}))
    .param(parameterDoc('includeItems', 'query', 'Should the list items be included in the results?', false, {type: 'bool', default: false}))
    .response(200, responseDoc('List found', schemas.list.listOfLists))
    .response(404, responseDoc('No list could be found'))
    .func(async req => {
      const {listName, openOnly, closeDate, includeItems} = req.query;
      const doIncludeItems = includeItems === 'true';
      let result = await queries.getLists(listName, openOnly, closeDate);
      if(!result.rows.length) {
        return new Response(404);
      }
      const lists = convertLists(result.rows);
      if(doIncludeItems) {
        lists.forEach(l => l.items = []);
        const itemResult = await queries.getListItems(lists.map(i => i.id));
        if(itemResult.rows.length) {
          const listsMap = new Map(lists.map(l => [l.id, l]));
          console.log(lists, itemResult.rows);
          itemResult.rows.forEach(r => {
            listsMap.get(r.list_id).items.push({
              name: r.name,
              description: r.description
            })
          })
        }
      }
      return lists;
    }),

  new Endpoint(
    'GET', '/list/id/{listId}', 'List', 'Retrieve a list for viewing',
    'Retrieve a list and all of its contents.')
  // .security(token.name)
    .param(parameterDoc('listId', 'path', 'The unique ID of a list', true, {type: 'integer'}))
    .response(200, responseDoc('List found', schemas.list.listOfLists))
    .response(404, responseDoc('No list could be found'))
    .func(async req => {
      const listId = parseInt(req.params.listId);
      const result = await queries.getListByID(listId);
      if(!result.rows.length) {
        return new Response(404);
      }
      const l = convertLists(result.rows)[0];
      l.items = result.rows.map(r => convertItem(r));
      return l;
    }),
];