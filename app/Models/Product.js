global.Product = bookshelf.Model.extend({
  tableName: 'productes',
  hasTimestamps: true,

  categories: function () {
    return this.hasMany(global.ProductCategory,'product_id');
  },
});
