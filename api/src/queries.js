
/**
 * @typedef {{
 *   name:string,
 *   description:string,
 *   items:{
 *     name:string,
 *     description:string
 *   }[]?
 * }} ListObject
 */

module.exports = {

  createList(listName, description){
    return [
      `
INSERT INTO list(name, description)
VALUES($1, $2)`,
      [listName, description]
    ]
  },

  getList(listName) {
    return [
      `
SELECT 
  json_build_object(
    'name', l.name,
    'description', l.description,
    'items', array_agg(json_build_object(
      'name', li.name,
      'description', li.description
    ))
  ) json
FROM list l
LEFT JOIN list_items li ON l.name = li.list_name
WHERE l.name = $1
GROUP BY l.name`,
      [listName]
    ]
  },

  clearList(listName) {
    return [
      `
DELETE FROM list_items
WHERE list_name = $1`,
      [listName]
    ]
  },

  createListItem(listName, name, description) {
    return[
      `
INSERT INTO list_items(list_name, name, description)
VALUES($1, $2, $3)`,
      [listName, name, description]
    ]
  },

  deleteItemFromList(listName, itemName) {
    return [
      `
DELETE FROM list_items
WHERE list_name = $1
  AND name = $2`,
      [listName, itemName]
    ]
  },
};
