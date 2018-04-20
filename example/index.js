var express 	= require('express');
var app     	= express();
var http 		= require('http').Server(app);
global.io	 	= require('socket.io')(http);
var fs 			= require("fs");
var path 		= require('path');
var multer 		= require('multer');
var bodyParser 	= require('body-parser');
var mongo 		= require('mongodb');
var mongoose 	= require('mongoose');
var session 	= require('express-session');
var engine 		= require('ejs-locals');
require('dotenv').config();
global.htmlencode 		= require('htmlencode');
global.config 			= require("./config/config");
global._token 			= '';
global.tokenError 		= { status :0, message :'token mismatch' };
/* **** DB CONFIGURATION **** */
mongoose.Promise = global.Promise;

var mongoConnectStr = "mongodb://";
if(global.config.db.username != null) {
	mongoConnectStr += global.config.db.username;
}
if(global.config.db.password != null) {
	mongoConnectStr += ":"+global.config.db.password+"@";
}
mongoConnectStr += global.config.db.host + ":"+global.config.db.port+"/"+global.config.db.database;

mongoose.connect(mongoConnectStr,{
	useMongoClient: true
});


/* **** VIEW CONFIGURATION **** */
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.engine('ejs', engine);
app.set('view engine', 'ejs');

/* **** SESSION CONFIGURATION **** */
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true,
    cookie: {
	    path: '/',
	    httpOnly: true,
	    secure: false,
	    maxAge: 3600000
	  },
	rolling: true
}));

/* **** POST COFIGURATION **** */
app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({ extended: false,
    parameterLimit: 1000000,
	limit: '50mb'}));

app.use(require('./routes/web'));
app.set('port', (process.env.PORT || 5000));

http.listen(app.get('port'), function(){
  console.log('Express Chat Server starts it"s run with port ' + app.get('port'));
});



