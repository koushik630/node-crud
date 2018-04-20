global.knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    charset  : 'utf8'
  }
});
global.bookshelf = require('bookshelf')(knex);
global.app.set('bookshelf', bookshelf);
global.allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
};
// parse application/x-www-form-urlencoded
global.app.use(allowCrossDomain);
// elsewhere,global. to use the bookshelf client:
global.bookshelf = app.get('bookshelf');
module.exports = global.bookshelf;
//console.log(bookshelf);
