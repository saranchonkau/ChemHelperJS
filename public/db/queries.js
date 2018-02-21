const path = require('path');

const knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: path.join(__dirname, '/nuclides.sqlite')
    }
});

module.exports.selectAll = () => {
    knex.select('nucid').from('nuclides')
        .then(rows => console.log('Rows: ', rows));
};

module.exports.selectFirst10 = () => {
    return knex.raw('select * from nuclides limit 10');
    knex.select().from('nuclides')
        .then(rows => console.log('Rows: ', rows));
};