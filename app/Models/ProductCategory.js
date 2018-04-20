global.ProductCategory = bookshelf.Model.extend({
  tableName: 'product_categories',
  hasTimestamps: true,

  Products: function () {
    return this.hasMany(global.Product,'id');
  },
  categoryMaster: function () {
    return this.belongsTo(global.Category);
  },
});
