angular.module('MainCtrl', []).controller('MainController', function($scope, $http) {

	$scope.tagline = 'To the moon and back!';	
	$scope.togline = 'To the moon and around!';
	$scope.dataLength = 1000;
	$scope.map = [];
	$scope.do = function(){
		$scope.togline = 'working...';
		var xll = document.getElementById("xll_input").value;
		var yll = document.getElementById("yll_input").value;
		var side = document.getElementById("side_input").value;
		$http({
		  method: 'GET',
		  //url: 'http://localhost:8080/api/map?xll=380000&yll=350000&side=50000'
		  url: 'http://localhost:8080/api/map?xll=' + xll + '&yll=' + yll + '&side=' + side
		}).then(function successCallback(response) {
			console.log("API success");
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
			console.log("done array")

			console.log("starting ready")
			var image = document.getElementById('i');
			console.log("found")
			//display image only after it's loaded
			image.onload = function(){this.style.display='block'}.bind(image);
			console.log("shown")
			//and finally set the .src
			image.src = dataToBase64($scope.map, dataLength, dataLength);
			console.log("done all")

		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    console.log("API failure");
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