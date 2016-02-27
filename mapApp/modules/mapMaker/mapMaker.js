var fs = require('fs');

var ELEMENT_WIDTH = 50
var REGION_WIDTH_IN_ELEMENTS = 200
var REGION_WIDTH = ELEMENT_WIDTH * REGION_WIDTH_IN_ELEMENTS
var BIT_DEPTH = 8

// Identifies all regions in a given square
// sqaure coord input as os map coordinates of lower left corner and length of side
// Returns list of coordinates of lower left corner of all regions
function findRegions(x, y, w) {
    var xregions = [];
    var yregions = [];
    var i = parseInt(x/REGION_WIDTH)*REGION_WIDTH;

    while (i <= x+w){
        xregions.push(i);
        i += REGION_WIDTH;
    }

    i = parseInt(y/REGION_WIDTH)*REGION_WIDTH;
    while (i <= y+w){
        yregions.push(i);
        i += REGION_WIDTH;
    }

    // storing elements as arrays len 2 not tuples
    var output = [];
    for (i = 0; i < xregions.length; i++) {
        for (j = 0; j < yregions.length; j++) {
            output.push([xregions[i], yregions[j]]);
        }
    }

    return output;
}

function makeFilename(x, y) {
    var t = "./modules/mapMaker/data/" + x.toString() + "-" + y.toString() + ".asc";
    return t;
}

function makeArrayForRegion(regionCoord){
    var output = [];
    var filename = makeFilename(regionCoord[0], regionCoord[1]);
    var f;

    // if file does not exist use the base file
    try {
        f = fs.readFileSync(filename,'utf8');
    }
    catch (e) {
        f = fs.readFileSync("./modules/mapMaker/data/BASE.asc",'utf8');
    }
    
    // cut off the 5 lines of meta info at the top of the file
    var startIndex = 0;
    var newLineCount = 0;
    while (newLineCount < 5){
        if (f[startIndex] == "\n") newLineCount++;
        startIndex++;
    }
    f = f.substring(startIndex, f.length);

    var rows = f.split("\n");
    for (i = 0; i < rows.length; i++){
        if (rows[i].length > 0) output.push(rows[i].trim().split(" ").map(parseFloat));
    }

    return output;
}

function appendMatrixTB(top,bottom) {
    // basic check not fully safe
    if (top[0].length != bottom[0].length) {
        // not sure if this will actually work but hey it should crash anyways
        throw Error();
    }
    return top.concat(bottom);
}

function combineToColumns(regions,coords) {
    var output = [];
    var currentX = -1;
    for (i = 0; i < regions.length; i++){
        if (coords[i][0] == currentX){
            output[output.length-1] = appendMatrixTB(regions[i],output[output.length-1]);
        }
        else{
            output.push(regions[i]);
            currentX = coords[i][0];
        }
    }
    return output;
}

function appendMatrixLR(left,right){
    // basic check not fully safe
    if (left.length != right.length) {
        // not sure if this will actually work but hey it should crash anyways
        throw Error();
    }
    output = [];
    newRow = [];
    for (z = 0; z < left.length; z++){
        newRow = new Array();
        newRow = left[z].concat(right[z]);
        output.push(newRow);
    }
    return output;
}

function combineToSquare(regions){
    output = regions[0];
    for (i = 1; i < regions.length; i++){
        output = appendMatrixLR(output, regions[i]);
    }
    return output;
}

// input list of coordinates
// outputs 2d array of the combination of regions
function createDataArray(regionsNeeded) {
    // first construct a 2d array for each region and place in new list
    // this list can be referenced using the regionsNeeded list
    var regions = [];
    for (regionIndex = 0; regionIndex <  regionsNeeded.length; regionIndex++){
        regions.push(makeArrayForRegion(regionsNeeded[regionIndex]));
    }

    // combine regions into columns
    regions = combineToColumns(regions,regionsNeeded);

    // combine columns into square
    regions = combineToSquare(regions);
    
    return regions;
}

function refineDataArray(dataArray, xll, yll, width){
    // the ll coord of the whole input square
    var squareXll = parseInt(xll/REGION_WIDTH)*REGION_WIDTH;
    var squareYll = parseInt(yll/REGION_WIDTH)*REGION_WIDTH;

    // the ll coord of the desired region in terms of number of elements
    var xStart = (xll-squareXll)/ELEMENT_WIDTH;
    var yStart = (yll-squareYll)/ELEMENT_WIDTH;
    // length of side of desired region in terms of number of elements

    var length = width/ELEMENT_WIDTH;

    var refinedOutput = [];
    var newRow = [];
    var startLoc = dataArray.length - yStart - length;
    while (startLoc < dataArray.length - yStart) {
        newRow = dataArray[startLoc].slice(xStart,xStart+length);
        refinedOutput.push(newRow);
        startLoc+=1;
    }

    return refinedOutput;
}

function refineDataArray2(dataArray, xll, yll, width){
    // the ll coord of the whole input square
    var squareXll = parseInt(xll/REGION_WIDTH)*REGION_WIDTH;
    var squareYll = parseInt(yll/REGION_WIDTH)*REGION_WIDTH;


}


function applyOverallContrast(data){
    return applyContrast(data,-120,1346);
}

function applyContrast(data, minimum, maximum){
    var factor = (65535)/(maximum-minimum);
    var output = [];
    for (i = 0; i < data.length; i++){
        output.push(data[i].map( function(num) {
            return Math.round((num-minimum)*factor);
        }));
    }
    return output;
}

// var regions = findRegions(360000, 170000, 10000);
// createDataArray(regions);

var MakeMap = function() {

};

MakeMap.prototype.create = function(x,y,w) {
    // build list of coordinates where the data lies
    var regions = findRegions(x,y,w);

    // build the 2d array of all squraes where the requested data exists
    var dataArray = createDataArray(regions);

    // refine array to just data included in the request
    var dataArray2 = refineDataArray(dataArray, x, y, w);

    // resize the array to the output size
    //dataArray = resizeArray(dataArray,desiredSize);

    // apply contrast
    var dataArray3 = applyOverallContrast(dataArray2);

    return dataArray3;
};


module.exports = MakeMap;
