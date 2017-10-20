// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
//var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
//var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
const proxy = require('http-proxy-middleware')
var apiProxy = proxy('/api', {target: 'http://localhost:3050/'});
app.use(apiProxy)

// configuration =================

//mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io
console.log(__dirname);
app.use(express.static(__dirname));                 // set the static files location /public/img will be /img for users
//app.use(morgan('dev'));                                        // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
//app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");