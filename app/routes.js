global.router = express.Router();
var HomeController = require('../app/Controllers/HomeController');
var UserController = require('../app/Controllers/UserController');
var CategoryController = require('../app/Controllers/CategoryController');
var ProductController = require('../app/Controllers/ProductController');
var AuthController = require('../app/Controllers/AuthController');
var UserController = require('../app/Controllers/UserController');

router.get('/', authenticationMiddleware(),HomeController.home);
router.get('/about', HomeController.about);
router.get('/chat', HomeController.getChat);
router.get('/register', HomeController.getRegister);
router.post('/register-post',urlencodedParser, HomeController.postRegister);
router.get('/login', HomeController.getLogin);
router.post('/auth-login', HomeController.postLogin);
router.get('/logout', HomeController.getLogout);
router.get('/profile',authenticationMiddleware(),UserController.profile);
router.get('/profile-edit/:id',authenticationMiddleware(),UserController.getEditProfile);
router.post('/profile-edit-post/:id',authenticationMiddleware(),UserController.postEditProfile);
//Category route
router.get('/categories', authenticationMiddleware(),CategoryController.categories);
router.get('/category-status-update/:id', authenticationMiddleware(),CategoryController.statusUpdate);
router.get('/category-add', authenticationMiddleware(),CategoryController.getAdd);
router.post('/category-add-post', authenticationMiddleware(),CategoryController.postAdd);
router.get('/category-edit/:id', authenticationMiddleware(),CategoryController.getEdit);
router.post('/category-edit-post/:id', authenticationMiddleware(),CategoryController.postEdit);
//Product route
router.get('/products',authenticationMiddleware(), ProductController.products);
router.get('/product-status-update/:id', authenticationMiddleware(),ProductController.statusUpdate);
router.get('/product-add', authenticationMiddleware(),ProductController.getAdd);
router.post('/product-add-post', authenticationMiddleware(),ProductController.postAdd);
router.get('/product-edit/:id', authenticationMiddleware(),ProductController.getEdit);
router.post('/product-edit-post/:id', authenticationMiddleware(),ProductController.postEdit);
//Login check middleware
function authenticationMiddleware(){
	return (req,res,next) =>{
		if (req.isAuthenticated()) return next();
		res.redirect('/login');
	}
}
module.exports = router;
