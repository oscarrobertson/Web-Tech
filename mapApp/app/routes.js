var MapMaker = require('../node_modules/mapMaker/mapMaker');

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

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};