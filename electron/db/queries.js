const path = require('path');

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '/nuclides.sqlite'),
  },
});

exports.executeQuery = query => {
  console.log('Query: ', query);
  return knex.raw(query);
};
