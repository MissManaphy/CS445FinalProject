/* 
 * 
 Code for this island generator was borrowed and repurposed from 
https://www.redblobgames.com/maps/terrain-from-noise/#islands

Thank you sir, god bless you
 */

function IslandGenerator(s) {
    this.waterLevel = .3;
    this.gridSize = this.setup(s);
    this.rad = s*Math.pow(2,s)/Math.pow(2,7);
    this.cityx = Math.floor(Math.random()*(this.gridSize/2))+this.rad;
    this.cityz = Math.floor(Math.random()*(this.gridSize/2))+this.rad;
    this.makeTerrain();
    //this.printHeights(); 
}

// The parameter s determine the gridSize = 2^s
// Note, the landscape itself, is then (gridSize+1)x(gridSize+1)
IslandGenerator.prototype.setup = function (s) {
    if (s < 2) { //  minimal size of grid is 4x4
        s = 2;
    } else if (s > 8) { //  maximum size of grid  (change this if you want bigger)
        s = 8; //comment out if you don't want a maximum size
    }
    g = Math.pow(2, s); // grid size must be a power of 2
    return g;
};


IslandGenerator.prototype.makeTerrain = function ()
{
    var simplex = new SimplexNoise(Math.random);
    this.heights = [];
    var a = 0.1; //pushes everything up
    var b = 1.; //pushes edges down
    var c = 2.0; //controls the drop off
    var d = 0;
    //Euclidean Distance d = 2*Math.sqrt(nx*nx + ny*ny)
    //Manhattan Distanced = 2*Math.max(Math.abs(nx), Math.abs(ny))
    var e = 0;
   
    for (var i = 0; i <= this.gridSize; i++) { //makes a grid of points in array form
        var row = [];
        for (var j = 0; j <= this.gridSize; j++) {
            row.push(0.0);
        }
        this.heights.push(row);
    }
    
    for (var z = 0; z < this.gridSize; z++) //height
    {
        for (var x = 0; x < this.gridSize; x++) //width
        {
            var nx = x/this.gridSize - 0.5;
            var nz = z/this.gridSize - 0.5;
            
            d = 2*Math.sqrt(nx*nx + nz*nz);
            
            e = (1 * (simplex.noise2D( 2.55 * nx,  2.55 * nz)+1)/2 //1
               + 0.40 * (simplex.noise2D( 3. * nx,  3 * nz)+1)/2 //2
               + 0.10 * (simplex.noise2D( 6 * nx,  6 * nz)+1)/2 //4
               + 0.11 * (simplex.noise2D( 12 * nx,  12 * nz)+1)/2 //8
               + 0.06 * (simplex.noise2D(25 * nx, 25 * nz)+1)/2 //16
               + 0.03 * (simplex.noise2D(64 * nx, 64 * nz)+1)/2); //32
            
            e = e + a - b*Math.pow(d,c);
           
            if (e<this.waterLevel)
                e=0;
            else
                e=(e-this.waterLevel)*0.4;
            this.heights[z][x] = e;
        }
    }
    
    for (var j=0; j< this.gridSize; j++) //setting the flat area
    {
        for (var i=0; i< this.gridSize; i++)
        {
            var rad = this.rad;
            var smooth = 10;
            var asqr = Math.pow((this.cityx - j), 2);
            var bsqr = Math.pow((this.cityz - i), 2);      
            var csqr = Math.sqrt(asqr + bsqr);        
            if (csqr <= rad) 
            {
                if(this.heights[i][j] <=0)
                {
                    this.cityx = Math.floor(Math.random()*this.gridSize);
                    this.cityz = Math.floor(Math.random()*this.gridSize); 
                    i = 0;
                    j = 0;
                } 
            }
        }
    }
    this.cityFlat();
};

IslandGenerator.prototype.getH = function (i, j) { //makes sure it wraps around and doesnt go out of bounds of the height array 
    w = this.gridSize + 1;  // length of array side
    i = i % w;
    j = j % w;
    if (i < 0) i += w;
    if (j < 0) j += w;
    return this.heights[i][j];
};


IslandGenerator.prototype.cityFlat = function (){
    for (var j=0; j< this.gridSize; j++) //setting the flat area
    {
        for (var i=0; i< this.gridSize; i++)
        {
            var rad = this.rad;
            var smooth = 40;
            var asqr = Math.pow((this.cityx - j), 2);
            var bsqr = Math.pow((this.cityz - i), 2);      
            var csqr = Math.sqrt(asqr + bsqr);        
            if (csqr <= rad) 
                {
                    this.heights[i][j] = .1;
                }
            if (csqr <= rad+smooth && csqr >= rad)
                { 
                    if (this.heights[i][j] !== 0){
                        this.heights[i][j] = ((this.heights[i][j]-.1)*(csqr-rad)/smooth) + .1;}
                }
        }
    }
    
};

