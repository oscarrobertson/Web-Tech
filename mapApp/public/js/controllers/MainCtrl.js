angular.module('MainCtrl', []).controller('MainController', function($scope, $http) {

	$scope.tagline = 'Enter UK OS map coordinates for the lower left corner of the square region you want to see!';	
	$scope.togline = "";
	$scope.dataLength = 1000;
	$scope.map = [];
	$scope.do = function(){
		$scope.togline = 'working...';
		var xll = document.getElementById("xll_input").value;
		xll = Math.round(xll/100)*100;
		var yll = document.getElementById("yll_input").value;
		yll = Math.round(yll/100)*100;
		var side = document.getElementById("side_input").value;
		side = Math.round(side/100)*100;
		var ds = document.getElementById("ds_input").value;

		var requestString = 'http://localhost:8080/api/map?xll=' + xll + '&yll=' + yll + '&side=' + side;
		if (!(ds == "")) {
			requestString += '&ds=' + ds;
		}
		$http({
		  method: 'GET',
		  url: requestString
		}).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
		    //$scope.map = response.data.message;
		    $scope.togline = 'done!';
		    var dataLength =  response.data.message.length;
		    $scope.dataLength = dataLength;
		    $scope.map = [];
		    console.log("start array")
			for(var i = 0, l = dataLength; i < l; i++){
				for(var j = 0, k =  dataLength; j < k; j++){
					var temp = parseInt(response.data.message[i][j]);
					temp = temp*256/65536;
					temp = parseInt(temp);
					$scope.map.push(temp);
				}
			}

			var image = document.getElementById('i');
			//display image only after it's loaded
			image.onload = function(){this.style.display='block'}.bind(image);
			//and finally set the .src
			image.src = dataToBase64($scope.map, dataLength, dataLength);

		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    console.log("API failure - map");
		});
	};

	function dataToBase64(colors, width, height){
	    var canvas = document.createElement('canvas'),
	        ctx = canvas.getContext('2d'),
	        color;
	    //setup canvas
	    canvas.width = width,
	    canvas.height = height;
	    //grab data
	    var data = ctx.getImageData(0, 0, width, height),
	        _data = data.data; //simple speed optimization    
	    //place data
	    for(var i = 0, l = _data.length; i < l; i+=4){
	        color = colors[i/4];
	        _data[i] = color,
	        _data[i+1] = color,
	        _data[i+2] = color,
	        _data[i+3] = 255;
	    }
	    ctx.putImageData(data, 0, 0);
	    //return base64 string
	    return canvas.toDataURL();
	}
});