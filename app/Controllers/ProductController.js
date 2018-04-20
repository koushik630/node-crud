var Category = require('../Models/Category');
var Product = require('../Models/Product');
var ProductCategory = require('../Models/ProductCategory');
const url = require('url');
// Student Controllerconsole.log(req);
const ProductController = {
	products : function(req, res ){
		global.Product.collection()
    .fetch({withRelated: ['categories.categoryMaster']})
    .then(function (collection) {
			res.render('pages/product/list',{
	    	page_name : 'product_list',
				'list' : collection.toJSON(),
				'query': req.query,
				req : req,
				res : res
	    });
			console.log(collection.toJSON);
			//response.cat = collection.categories;
		//	console.log(collection.related('categories'));
    //  res.json({error: false, data: collection.toJSON()});
    })
    .otherwise(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
	},
	//=============================================================================
	statusUpdate : function(req, res ){
		//console.log(res);
		global.Product.forge({id:req.params.id})
    .fetch({require: true})
    .then(function (collection) {
			var updateValue = {};
					if(collection.attributes.status=="ACTIVE")
							updateValue = {status: 'INACTIVE'};
					else if(collection.attributes.status=="INACTIVE")
							updateValue = {status: 'ACTIVE'};
				collection.save(updateValue)
				.then(function () {
					 res.redirect(url.format({
				       pathname:"/products",
				       query: {
				          error: false,
				          successMsg: "Status changed successfully.",
				        }
				     }));
	      })
	      .otherwise(function (err) {
	        res.status(500).json({error: true, data: {message: err.message}});
	      });
    })
    .otherwise(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
	},
//=============================================================================
getAdd : function(req, res ){
		global.Category
		.collection()
		.query(function(qb) {
  		qb.whereIn('status', ['ACTIVE','ALL'])
		})
    .fetch()
    .then(function (collection) {
			res.render('pages/product/add',{
	    	page_name : 'product_list',
				'category_list' : collection.toJSON(),
				'query': req.query,
				req : req,
				res : res
	    });
			console.log(collection.toJSON);
			//response.cat = collection.categories;
		//	console.log(collection.related('categories'));
    //  res.json({error: false, data: collection.toJSON()});
    })
    .otherwise(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
	},
	//===========================================================================
postAdd : function(req, res ){
		var upload = multer({
		storage: global.productStorage,
		fileFilter: function(req, file, callback) {
			var ext = global.path.extname(file.originalname)
			if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
				return callback(res.end('Only images are allowed'), null)
			}
			callback(null, true)
		}
		}).single('product_image')
		upload(req, res, function(err) {
			// console.log(req.body)
					global.Product.forge({
				      name: req.body.name,
				      description: req.body.description,
							product_image : (req.file!=undefined) ? req.file.filename : null,
							status: 'ACTIVE',
				    })
			    .save()
			    .then(function (productVal) {
									console.log(productVal.attributes.id);
									global.ProductCategory.forge({
						      category_id: req.body.category_id,
						      product_id:  productVal.attributes.id,
						    })
					    .save()
					    .then(function (collection) {
								console.log(collection.toJSON);
					    })
					    .otherwise(function (err) {
					      res.status(500).json({error: true, data: {message: err.message}});
					    });
						res.redirect(url.format({
					   pathname:"/products",
					   query: {
					      error: false,
					      successMsg: "Records saved sucessfully.",
					    }
				 		}));
						//console.log(productVal.toJSON);
						//response.cat = collection.categories;
					//	console.log(collection.related('categories'));
			    //  res.json({error: false, data: collection.toJSON()});
			    })
			    .otherwise(function (err) {
			      res.status(500).json({error: true, data: {message: err.message}});
			    });
		//	res.end('File is uploaded')
			})
	},
//=============================================================================
getEdit : function(req, res ){
		global.Category.collection()
		.query(function(qb) {
  		qb.whereIn('status', ['ACTIVE','ALL'])
		})
    .fetch()
    .then(function (collection) {
		global.Product.forge({id:req.params.id})
    .fetch({withRelated: ['categories.categoryMaster']})
    .then(function (productCollection) {
				res.render('pages/product/edit',{
	    	page_name : 'product_list',
				'category_list' : collection.toJSON(),
				'query': req.query,
				'productData' : productCollection.toJSON(),
				req : req,
				res : res
	    });
			console.log(collection.toJSON);
			//response.cat = collection.categories;
		//	console.log(collection.related('categories'));
    //  res.json({error: false, data: collection.toJSON()});
    })
    .otherwise(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
		});
  })
    .otherwise(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
},
//=============================================================================
postEdit: function(req, res) {
    var upload = multer({
        storage: global.productStorage,
        fileFilter: function(req, file, callback) {
            var ext = global.path.extname(file.originalname)
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(res.end('Only images are allowed'), null)
            }
            callback(null, true)
        }
    }).single('product_image')
    upload(req, res, function(err) {
        // console.log(req.body)
        global.Product.forge({
                id: req.params.id
            })
            .fetch({
                withRelated: ['categories.categoryMaster']
            })
            .then(function(productVal) {
                var data = productVal.toJSON();
                //=============================================================K
                //update product Category
                global.ProductCategory.forge({
                        id: data.categories[0].id
                    })
                    .fetch({
                        require: true
                    })
                    .then(function(productCategoryVal) {
                        productCategoryVal.save({
                                category_id: req.body.category_id || productCategoryVal.get('category_id'),
                            })
                            .then(function() {
                                //res.json({error: false, data: {message: 'User details updated'}});
                            })
                            .otherwise(function(err) {
                                res.status(500).json({
                                    error: true,
                                    data: {
                                        message: err.message
                                    }
                                });
                            });
                    })
                    .otherwise(function(err) {
                        res.status(500).json({
                            error: true,
                            data: {
                                message: err.message
                            }
                        });
                    });
                //End
                //=============================================================K
                productVal.save({
                        name: req.body.name || productVal.get('name'),
                        description: req.body.description || productVal.get('description'),
                        product_image: (req.file != undefined) ? req.file.filename : null || productVal.get('product_image'),

                    })
                    .then(function() {
                        res.redirect(url.format({
                            pathname: "/products",
                            query: {
                                error: false,
                                successMsg: "Records Updated sucessfully.",
                            }
                        }));
                    })
                    .otherwise(function(err) {
                        res.status(500).json({
                            error: true,
                            data: {
                                message: err.message
                            }
                        });
                    });
            })
            .otherwise(function(err) {
                res.status(500).json({
                    error: true,
                    data: {
                        message: err.message
                    }
                });
            });
        //	res.end('File is uploaded')
    })
},
//=======================================================================
}
//https://evdokimovm.github.io/javascript/nodejs/expressjs/multer/2016/11/03/Upload-files-to-server-using-NodeJS-and-Multer-package-filter-upload-files-by-extension.html
//https://github.com/qawemlilo
//https://codeforgeek.com/2014/09/install-atom-editor-ubuntu-14-04/#
// GET /users - fetch all users
// POST /users - create a new user
// GET /users/:id - fetch a single user by id
// PUT /users/:id - update user
// DELETE /users/:id - delete user

module.exports = ProductController;
