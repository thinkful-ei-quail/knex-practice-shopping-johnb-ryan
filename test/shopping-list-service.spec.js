require('dotenv').config();
const shoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const { expect } = require('chai');

describe.only(`Shopping-list service object`, function () {
  let db;
  let testShoppingListItems = [
    {
      id: 1,
      name: 'item 1',
      price: 100,
      date_added: new Date('2020-08-19T15:41:02.950Z'),
      checked: false,
      category: 'Breakfast',
    },
    {
      id: 2,
      name: 'item 2',
      price: 200,
      date_added: new Date('2020-08-18T15:41:02.950Z'),
      checked: false,
      category: 'Lunch',
    },
    {
      id: 3,
      name: 'item 3',
      price: 300,
      date_added: new Date('2020-08-17T15:41:02.950Z'),
      checked: true,
      category: 'Main',
    },
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db('shopping_list').truncate());

  afterEach(() => db('shopping_list').truncate());

  after(() => db.destroy());

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return shoppingListService.getAllItems(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });
  });
});
