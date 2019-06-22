module.exports = {
    createList(listName, description){
        return[
            'insert into list(name, close_date, description)' +
            'values($1, $2, $3)', [listName, new Date(0, 0, 0, 0, 0, 0, 0), description]
        ]
    },

    getActiveListID(listName) {
        return[
        'select id from list where list.name = $1 and list.close_date = $2', [listName, new Date(0, 0, 0, 0, 0, 0, 0)]
        ]
    },

    createListItem(id, name, description) {
        return[
            'insert into list_items(list_id, name, description)' +
            'values($1, $2, $3)', [id, name, description]
        ]
    }
};
