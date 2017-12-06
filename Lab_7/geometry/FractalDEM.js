/* 
 * 
 * This class uses the  diamond-square algoritm
 See http://www.gameprogrammer.com/fractal.html#diamond
 * to generate a 2D array of heights for a fractal landscape.  The height
 * values are between 0 and 1. 
 * 
 * The heights are stored as a 2D array of size
 *                  (gridSize+1)x(gridSize+1)
 *  where gridSize must be a power of 2.  The constructor takes
 *  as input s = the power of 2
 *  For example, if s=3, then the gridSize is 8=2^3, and the 2d array is 9x9
 *
 * The values in the 1D heights array can be accessed directly, but it is more convenient to use getH(i,j),
 * which returns the height value associated with the row i and column j of the landscape.  The getH method
 * has the safety feature that if i or j are out of range, it returns the wrapped around value.
 * 
 * 
 *******   SCALING AND CREATING THE WATER ********
 * After the heights are initally generated using the diamond-square algorithm,
 * the heights are scaled to be in the range from 0 to 1 where 0 is the "waterlevel"  and
 * 1 is the highest peak. 
 * 
 * This way, it is easy to create a color map: a height equal to zero is the water (e.g. blue) and
 * a height equal to 1 must be a mountain top (e.g. white). The heights can, of course, be rescaled
 * in either your javascript code or in your shader but, depending on where this is done, 
 * make sure the color map reflects the scaling.
 */

function FractalDEM(s) {
    this.waterLevel = .3;
    this.gridSize = this.setup(s);
    this.makeTerrain();
    //this.printHeights(); 
}

// The parameter s determine the gridSize = 2^s
// Note, the landscape itself, is then (gridSize+1)x(gridSize+1)
FractalDEM.prototype.setup = function (s) {
    if (s < 2) { //  minimal size of grid is 4x4
        s = 2;
    } else if (s > 8) { //  maximum size of grid  (change this if you want bigger)
        s = 8; //comment out if you don't want a maximum size
    }
    g = Math.pow(2, s); // grid size must be a power of 2
    return g;
};

// Uses the diamond-square algorithm to generate a fractal landscape.
//     See http://www.gameprogrammer.com/fractal.html#diamond
FractalDEM.prototype.makeTerrain = function ()
{
    this.heights = [];
    for (var i = 0; i <= this.gridSize; i++) { //makes a grid o
        var row = [];
        for (var j = 0; j <= this.gridSize; j++) {
            row.push(0.0);
        }
        this.heights.push(row);
    }

    this.heights[0][0] = 0.1; //sets the edges to 0.1
    this.heights[0][this.gridSize] = 0.1; //sets the edges to 0.1
    this.heights[this.gridSize][0] = 0.1; //sets the edges to 0.1
    this.heights[this.gridSize][this.gridSize] = 0.1; //sets the edges to 0.1
    var inc = this.gridSize; // makes the inc equal to the grid size, which is 2^s
    var x;
    while (inc > 1) {
        /* Square Step
        Starts by getting the points of the big square and then the center point of that
        at the bottom inc gets cut in half before it ever adds to i
        so it keeps cutting down half by half till inc is = 1
        it does end as long as that identifier is in the code, otherwise it would go on infinitely
        which was confusing there for a sec
        */ 
        for (var i = 0; i < this.gridSize; i = i + inc) 
        {
            for (var j = 0; j < this.gridSize; j = j + inc) {
                var midpoint = (this.getH(i, j) + this.getH(i + inc, j) +
                        this.getH(i, j + inc) + this.getH(i + inc, j + inc)) / 4.0;
                x = this.getRand(inc);
                var k = i + inc / 2;
                var m = j + inc / 2;   // k and m  should be integers!
                this.heights[k][m] = x + midpoint;
            }
        }

        // Diamond Step
        for (var i = 0; i < this.gridSize; i = i + inc) {
            for (var j = 0; j < this.gridSize; j = j + inc) {
                var k = i + inc / 2;
                var m = j;
                this.calcAve(k, m, inc);

                k = i + inc / 2;
                m = j + inc;
                this.calcAve(k, m, inc);

                k = i;
                m = j + inc / 2;
                this.calcAve(k, m, inc);

                k = i + inc;
                m = j + inc / 2;
                this.calcAve(k, m, inc);
            }
        }
        inc = inc / 2;
    }
    this.scaleH();
};

FractalDEM.prototype.calcAve = function (k, m, inc) {
    x = this.getRand(inc);
    var i2 = Math.floor(inc / 2);
    midpoint = (this.getH(k - i2, m) + this.getH(k + i2, m) +
            this.getH(k, m + i2) + this.getH(k, m - i2)) / 4.0;
    this.heights[k][m] = midpoint + x;
};

FractalDEM.prototype.scaleH = function ()
{
    // find min and max values
    var ymax = -10000, ymin = 10000;
    for (var i = 0; i <= this.gridSize; i++)
    {
        for (var j = 0; j <= this.gridSize; j++)
        {
            if (this.heights[i][j] > ymax)
            {
                ymax = this.heights[i][j];
            } else if (this.heights[i][j] < ymin)
            {
                ymin = this.heights[i][j];
            }
        }
    }

    // scale heights so they are between 0 and 1 and then, if the height is less than the waterlevel, set the
    // height to waterlevel.  Then scale again so that the height is between 0 and  1, i.e. so that
    // the waterlevel corresponds to 0.
    var maxtemp = 0;
    for (var i = 0; i <= this.gridSize; i++) {
        for (var j = 0; j <= this.gridSize; j++) {
            var temp1 = this.heights[i][j];
            var scaledValue = (this.heights[i][j] - ymin) / (ymax - ymin);
            var temp2 = scaledValue;
            if (scaledValue < this.waterLevel) {
                this.heights[i][j] = 0;
            } else {
                this.heights[i][j] = (scaledValue - this.waterLevel) / (1.0 - this.waterLevel);
                if (this.heights[i][j] > maxtemp)
                    maxtemp = this.heights[i][j];
            }
        }
    }
};

// wrap around
FractalDEM.prototype.getH = function (i, j) { //makes sure it wraps around and doesnt go out of bounds of the height array 
    w = this.gridSize + 1;  // length of array side
    i = i % w;
    j = j % w;
    if (i < 0) i += w;
    if (j < 0) j += w;
    return this.heights[i][j];
};

/** Compute a random float between -inc/2 and inc/2
 * 
 * @param {type} inc
 * @return {Number}
 */

FractalDEM.prototype.getRand = function (inc)
{
    var r = Math.random();
    return  (inc * r - inc / 2.);
};

FractalDEM.prototype.printHeights = function () {
    console.log("heights: " + this.heights);
    console.log("gridSize: " + this.gridSize + "\nheights: \n");
    for (var i = 0; i <= this.gridSize; i++) {
        console.log("i=" + i + ":\n");
        for (var j = 0; j <= this.gridSize; j++)
        {
            console.log("j=" + j + "  heights=" + this.heights[i][j] + " ");
        }
        console.log("\n");
    }
};
