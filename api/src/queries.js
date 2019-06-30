

const zeroDate = new Date(0, 0, 0, 0, 0, 0, 0);

module.exports = {

    createList(listName, description){
        return[
            'insert into list(name, close_date, description)' +
            'values($1, $2, $3)', [listName, zeroDate, description]
        ]
    },

    getActiveListID(listName) {
        return[
        'select id from list where list.name = $1 and list.close_date = $2', [listName, zeroDate]
        ]
    },

    getLists(listName, openOnly, closeDate) {
        const where = [];
        const params = [];
        if(listName) {
            where.push('list.name = $1');
            params.push(listName);
        }
        if(openOnly) {
            where.push(`list.close_date = $${where.length + 1}`);
            params.push(zeroDate);
        } else if(closeDate) {
            where.push(`list.close_date = $${where.length + 1}`);
            params.push(closeDate);
        }
        const q = ['select * from list'];
        if(where.length) {
            q.push(' where ' + where.join(' and '))
        }
        return [...q, params]
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
            'insert into list_items(list_id, name, description)' +
            'values($1, $2, $3)', [id, name, description]
        ]
    }
};
