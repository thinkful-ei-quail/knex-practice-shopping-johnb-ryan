require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

function searchShoppingList(searchTerm) {
  knexInstance
    .select('name', 'price', 'category')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then((result) => {
      console.log(result);
    });
}

searchShoppingList('burger');

function paginateResults(page) {
  const productsPerPage = 6;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select('name', 'price', 'category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then((result) => {
      console.log(result);
    });
}

paginateResults(1);

function itemsAfterDate(daysAgo) {
  knexInstance
    .select('name', 'price', 'category', 'date_added')
    .from('shopping_list')
    .orderBy([{ column: 'date_added', order: 'ASC' }])
    .where(
      'date_added',
      '>',
      knexInstance.raw("now() - '?? days'::INTERVAL", daysAgo)
    )
    .then((result) => {
      console.log(result);
    });
}
itemsAfterDate(1);

// Get total cost for each category

function totalCostPerCategory() {
  knexInstance
    .select('category')
    .sum('price as p')
    .from('shopping_list')
    .groupBy('category')
    .then((result) => {
      console.log(result);
    });
}

totalCostPerCategory();
