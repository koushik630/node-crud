global.Category = bookshelf.Model.extend({
  tableName: 'categories',
  hasTimestamps: true,

  Products: function () {
    return this.hasMany(global.Product,'category_id');
  }
});
