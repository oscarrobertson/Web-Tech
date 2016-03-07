var MapMaker = require('../modules/mapMaker/mapMaker');
var OsGridRef = require('../modules/conv/osgridref');
var LatLon = require('../modules/conv/latlon-ellipsoidal');
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
			var desiredSize = undefined;
			if (req.query.hasOwnProperty('ds')){
				desiredSize = parseInt(req.query.ds);
			}

            var mapMaker = new MapMaker();
    		var output = mapMaker.create(xll, yll, side, desiredSize);
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

	// outputs obj with .easting and .northing
	app.get('/api/latLonToOsGrid', function(req, res) {
			console.log(req.query);
			// sanity check on input should be done

			var lat = parseFloat(req.query.lat);
			var lon = parseFloat(req.query.lon);

			var t1 = OsGridRef.latLonToOsGrid(new LatLon(lat, lon));

			res.json({ easting : t1.easting, northing : t1.northing});
        });

	// outputs obj with .lat and .lon
	app.get('/api/osGridToLatLon', function(req, res) {
			console.log(req.query);
			// sanity check on input should be done

			var northing = parseFloat(req.query.northing);
			var easting = parseFloat(req.query.easting);

			t1 = OsGridRef.osGridToLatLon(new OsGridRef(easting, northing));

			res.json({ lat : t1.lat, lon : t1.lon});
        });

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};