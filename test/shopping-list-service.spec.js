require('dotenv').config();
const shoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const ShoppingListService = require('../src/shopping-list-service');
const { expect } = require('chai');
const pg = require('pg');
const PG_DECIMAL_OID = 1700;
pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat); //<-- were used to convert string return value to expected numeric value.

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

    it('insertItem() inserts a new item and resolves new item with an "id"', () => {
      const newItem = {
        name: 'New Item',
        price: 10.0,
        date_added: new Date('2020-08-16T15:41:02.950Z'),
        checked: false,
        category: 'Breakfast',
      };
      return shoppingListService.insertItem(db, newItem).then((actual) => {
        expect(actual.id).to.exist;
        expect(actual.name).to.eql(newItem.name);
        expect(actual.price).to.eql(newItem.price);
        expect(actual.date_added).to.eql(newItem.date_added);
        expect(actual.checked).to.eql(newItem.checked);
        expect(actual.category).to.eql(newItem.category);
      });
    });
  });

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => db.into('shopping_list').insert(testShoppingListItems));

    it(`getAllItems() resolves all items from 'shopping_list table'`, () => {
      return ShoppingListService.getAllItems(db).then((actual) => {
        expect(actual).to.eql(testShoppingListItems);
      });
    });

    it('getById() finds an item in the table with a matching id', () => {
      const thirdId = 3;
      const thirdShoppingListItem = testShoppingListItems[thirdId - 1];
      return shoppingListService.getById(db, thirdId).then((actual) => {
        expect(actual).to.eql(thirdShoppingListItem);
      });
    });

    it('updateItem() updates an item from the shopping list table', () => {
      const idOfItemToUpdate = 3;
      const newData = {
        name: 'New Name',
        price: 105.0,
        date_added: new Date('2020-08-19T18:43:27.734Z'),
        checked: false,
        category: 'Breakfast',
      };
      return shoppingListService
        .updateItem(db, idOfItemToUpdate, newData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then((item) => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newData,
          });
        });
    });

    it(`deleteItem() removes an item by id`, () => {
      const itemId = 3;
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => shoppingListService.getAllItems(db))
        .then((allItems) => {
          // copy the test items array without the "deleted" item
          const expected = testShoppingListItems.filter(
            (item) => item.id !== itemId
          );
          expect(allItems).to.eql(expected);
        });
    });
  });
});
