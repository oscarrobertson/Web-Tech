// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// configuration ===========================================
	
// config files
var db = require('./config/db');

var port = process.env.PORT || 8080; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

app.use(negotiate)
app.use(express.static(__dirname + '/public', {setHeaders: deliverXHTML})); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// Content negotiation functions
// Check whether the browser accepts XHTML, and record it in the response.
function negotiate(req, res, next){
	var accepts = req.headers.accept.split(",");
	if(accepts.indexOf("application/xhtml+xml") >= 0) res.acceptsXHTML = true;
	next();
}

// Called by express.static. Delivers response as XHTML when appropriate.
function deliverXHTML(res, path, stat){
	if(ends(path, '.html') && res.acceptsXHTML) {
		res.header("Content-Type", "application/xhtml+xml");
	}
}

function ends(s, x) {
	return s.indexOf(x, s.length-x.length) >= 0;
}

// start app ===============================================
app.listen(port, '0.0.0.0');	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app