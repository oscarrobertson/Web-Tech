var MapMaker = require('../modules/mapMaker/mapMaker');
var fs = require('fs');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
	app.get('/api/map', function(req, res) {
			console.log(req.query);
			// sanity check on input should be done

			var xll = parseInt(req.query.xll);
			var yll = parseInt(req.query.yll);
			var side = parseInt(req.query.side);

            var mapMaker = new MapMaker();
    		var output = mapMaker.create(xll, yll, side);
    		res.json({ message: output });
        });

	app.get('/api/mappng', function(req, res) {
			console.log(req.query);
			// sanity check on input should be done

			var x = parseInt(req.query.x);
			var y = parseInt(req.query.y);
			var z = parseInt(req.query.z);

            
    		var img = fs.readFileSync('./modules/mapMaker/mapPngs/' + z +'/' + x +'/'+ y + '.png');
			res.writeHead(200, {'Content-Type': 'image/png' });
			res.end(img, 'binary');
        });

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};