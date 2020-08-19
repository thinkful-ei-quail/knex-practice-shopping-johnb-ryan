const ShoppingListService = {
  getAllItems(knex) {
    return knex.select().from('shopping_list');
  },

  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then((rows) => rows[0]);
  },

  getById(knex, id) {
    return knex.select('*').from('shopping_list').where({ id }).first();
  },

  updateItem(knex, id, newData) {
    return knex('shopping_list').where({ id }).update(newData);
  },

  deleteItem(knex, id) {
    return knex('shopping_list').where({ id }).delete();
  },
};

module.exports = ShoppingListService;
