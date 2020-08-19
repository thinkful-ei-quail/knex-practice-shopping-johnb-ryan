const ShoppingListService = {
  getAllItems(knex) {
    return knex.select().from('shopping_list');
  },
};

module.exports = ShoppingListService;
