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
			var h = parseInt(req.query.h);
			var w = parseInt(req.query.w);
			var desiredSize = undefined;
			if (req.query.hasOwnProperty('ds')){
				desiredSize = parseInt(req.query.ds);
			}

            var mapMaker = new MapMaker();
    		var output = mapMaker.create(xll, yll, h, w, desiredSize);
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

	app.get('/api/osGridToLatLonSquare', function(req, res) {
			console.log(req.query);
			// sanity check on input should be done

			var squareSide = parseInt(req.query.squareSide);
			var northing = parseFloat(req.query.northing);
			var easting = parseFloat(req.query.easting);

			output = {};

			t1 = OsGridRef.osGridToLatLon(new OsGridRef(easting, northing));
			output["0"] = {lat : t1.lat, lon : t1.lon};
			t1 = OsGridRef.osGridToLatLon(new OsGridRef(easting+squareSide, northing));
			output["1"] = {lat : t1.lat, lon : t1.lon};
			t1 = OsGridRef.osGridToLatLon(new OsGridRef(easting+squareSide, northing+squareSide));
			output["2"] = {lat : t1.lat, lon : t1.lon};
			t1 = OsGridRef.osGridToLatLon(new OsGridRef(easting, northing+squareSide));
			output["3"] = {lat : t1.lat, lon : t1.lon};

			res.json(output);
        });

	app.get('/api/LatLonSquToMap', function(req, res) {
			console.log(req.query);
			// sanity check on input should be done

			var n = req.query.n;
			var s = req.query.s;
			var e = req.query.e;
			var w = req.query.w;

			var sw = OsGridRef.latLonToOsGrid(new LatLon(s,w));
			var se = OsGridRef.latLonToOsGrid(new LatLon(s,e));
			var nw = OsGridRef.latLonToOsGrid(new LatLon(n,w));
			var ne = OsGridRef.latLonToOsGrid(new LatLon(n,e));

			var bottom = Math.min(sw.northing,se.northing);
			var top = Math.max(ne.northing,nw.northing);
			var left = Math.min(sw.easting,nw.easting);
			var right = Math.max(se.easting,ne.easting);

			var sw2 = [bottom,left];
			var se2 = [bottom,right];
			var ne2 = [top,right];
			var nw2 = [top,left];

			sw2 = OsGridRef.osGridToLatLon(new OsGridRef(sw2[1], sw2[0]));
			se2 = OsGridRef.osGridToLatLon(new OsGridRef(se2[1], se2[0]));
			ne2 = OsGridRef.osGridToLatLon(new OsGridRef(ne2[1], ne2[0]));
			nw2 = OsGridRef.osGridToLatLon(new OsGridRef(nw2[1], nw2[0]));

			console.log([top-bottom,right-left]);
    		

			output = {res : [sw,se,ne,nw], res2 : [sw2,se2,ne2,nw2]};

			res.json(output);
        });


	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};