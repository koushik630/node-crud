const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
});
module.exports=User;
