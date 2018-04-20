//multer setting
global.productStorage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/uploads/products/images/')
	},
	filename: function(req, file, callback) {
		//console.log(file)
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
});
global.categoryStorage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/uploads/categories/images/')
	},
	filename: function(req, file, callback) {
		//console.log(file)
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
});
//for using cookie parser
app.use(cookieParser());
