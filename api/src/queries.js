module.exports = {
    createList(listName, description){
        return[
            'insert into list(name, close_date, description)' +
            'values($1, $2, $3)', [listName, new Date(0, 0, 0, 0, 0, 0, 0), description]
        ]
    }
}