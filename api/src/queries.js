

const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);

module.exports = {

  createList(listName, description){
    return[
      'insert into list(name, close_date, description)',
      'values($1, $2, $3)', [listName, zeroDate, description]
    ]
  },

  deleteItemFromList(listId, itemName, itemDescription) {
    return [
      'delete from list_items',
      'where ctid in (',
      '  select ctid',
      '  from list_items',
      '  where list_id = $1',
      '    and name = $2',
      '    and description = $3',
      '  limit 1)',
      [listId, itemName, itemDescription]
    ]
  },

  getActiveListID(listName) {
    return [
      'select id from list where list.name = $1 and list.close_date = $2', [listName, zeroDate]
    ]
  },

  getLists(listName, openOnly, closeDate) {
    const where = [];
    const params = [];
    const q = ['select *', 'from list l'];
    if(listName) {
      where.push('l.name = $1');
      params.push(listName);
    }
    if(openOnly) {
      where.push(`l.close_date = $${where.length + 1}`);
      params.push(zeroDate);
    } else if(closeDate) {
      where.push(`l.close_date = $${where.length + 1}`);
      params.push(closeDate);
    }
    if(where.length) {
      q.push(' where ' + where.join(' and '))
    }
    return [...q, params]
  },

  getListItems(listIds) {
    return ['select * from list_items li where li.list_id = ANY($1::int[])', [listIds]]
  },

  getListByID(listId) {
    return [
      'select l.name as name, close_date, l.description as description, li.name as item_name, li.description as item_description',
      'from list l, list_items li',
      'where li.list_id = l.id',
      '  and l.id = $1', [listId]
    ]
  },

  createListItem(id, name, description) {
    return[
      'insert into list_items(list_id, name, description)',
      'values($1, $2, $3)', [id, name, description]
    ]
  }
};
