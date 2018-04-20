var Category = require('../Models/Category');
var Product = require('../Models/Product');
var ProductCategory = require('../Models/ProductCategory');
global.User = require('../Models/User');
const url = require('url');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
// Student Controller
const CategoryController = {
	//===========================================================================
	categories : function(req, res ){
		global.Category.collection()
    .fetch()
    .then(function (collection) {
  			res.render('pages/category/list',{
	    	page_name : 'category_list',
				'list' : collection.toJSON(),
				'query': req.query,
				req : req,
				res : res
	    });
    })
    .otherwise(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
	},
//===========================================================================
	statusUpdate : function(req, res ){
		//console.log(res);
		global.Category.forge({id:req.params.id})
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
				       pathname:"/categories",
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
			res.render('pages/category/add',{
	    	page_name : 'category_list',
				'query': req.query,
				req : req,
				res : res
	    });
	},
	//===========================================================================
postAdd : function(req, res ){
	console.log(req.body)
	// 	var upload = multer({
	// 	storage: global.categoryStorage,
	// 	fileFilter: function(req, file, callback) {
	// 		var ext = global.path.extname(file.originalname)
	// 		if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
	// 			return callback(res.end('Only images are allowed'), null)
	// 		}
	// 		callback(null, true)
	// 	}
	// }).single('category_image')
	// 	upload(req, res, function(err) {
	// 		console.log(req.body)
	// 				global.Category.forge({
	// 			      name: req.body.name,
	// 			      description: req.body.description,
	// 						status: (typeof req.body.status!='undefined') ? req.body.status : 'ACTIVE',
	// 						image : (req.file!=undefined) ? req.file.filename : null,
	// 			    })
	// 		    .save()
	// 		    .then(function (collections) {
	// 					res.redirect(url.format({
	// 				   pathname:"/categories",
	// 				   query: {
	// 				      error: false,
	// 				      successMsg: "Records saved sucessfully.",
	// 				    }
	// 			 		}));
	// 					//console.log(productVal.toJSON);
	// 					//response.cat = collection.categories;
	// 				//	console.log(collection.related('categories'));
	// 		    //  res.json({error: false, data: collection.toJSON()});
	// 		    })
	// 		    .otherwise(function (err) {
	// 		      res.status(500).json({error: true, data: {message: err.message}});
	// 		    });
	// 	//	res.end('File is uploaded')
	// 		})
	},
//=============================================================================
getEdit : function(req, res ){
		global.Category.forge({id:req.params.id})
    .fetch({require: true})
    .then(function (collection) {
				res.render('pages/category/edit',{
	    	page_name : 'category_list',
				'list' : collection.toJSON(),
				'query': req.query,
				req : req,
				res : res
	    });
  })
    .otherwise(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
},
//=============================================================================
postEdit: function(req, res) {
    var upload = multer({
        storage: global.categoryStorage,
        fileFilter: function(req, file, callback) {
            var ext = global.path.extname(file.originalname)
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(res.end('Only images are allowed'), null)
            }
            callback(null, true)
        }
    }).single('category_image')
    upload(req, res, function(err) {
        // console.log(req.body)
        global.Category.forge({
                id: req.params.id
            })
            .fetch({require: true})
            .then(function(categoryVal) {
                categoryVal.save({
                        name: req.body.name || categoryVal.get('name'),
                        description: req.body.description || categoryVal.get('description'),
                        image: (req.file != undefined) ? req.file.filename : null || categoryVal.get('category_image'),
												status: (typeof req.body.status!='undefined') ? req.body.status : 'ACTIVE',

                    })
                    .then(function() {
                        res.redirect(url.format({
                            pathname: "/categories",
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
}
//https://github.com/qawemlilo
// GET /users - fetch all users
// POST /users - create a new user
// GET /users/:id - fetch a single user by id
// PUT /users/:id - update user
// DELETE /users/:id - delete user

module.exports = CategoryController;
