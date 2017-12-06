/* Anna Neshyba, October 16, 2017, Fractal Class
 * This class contains the code to produce the grid outlined in FractalDEM
 */

function fractal(x,z) {
    frac = new IslandGenerator(8);
    
    this.name = "fractal";
    this.landscape = frac;
    this.grid = this.landscape.gridSize; 
    
    this.numTriangles = this.grid * this.grid * 2; 
    this.numVertices = this.numTriangles * 3;
    this.scaleX = x/this.grid;
    this.scaleZ = z/this.grid;
    this.scaleY = 3; 
    
    scaleXG = this.scaleX;
    scaleZG = this.scaleZ; 
    scaleYG = this.scaleY;
    
    totalX = x;
    totalZ = z; 

    this.vertices = [];
    this.normals = [];
    this.colors = [];
    this.texCoords = []; 
    
    this.makeTriangles(); 
        
} 

fractal.prototype.makeTriangles = function () {
    for (var j = 0; j < this.grid; j++) {
        for (var i = 0; i < this.grid; i++ ) {
            
            // top triangle in square
            this.vertices.push(vec4(i*this.scaleX, this.landscape.getH(i,j)*this.scaleY, j*this.scaleZ, 1));
            this.vertices.push(vec4((i+1)*this.scaleX, this.landscape.getH(i+1,j)*this.scaleY, j*this.scaleZ, 1));
            this.vertices.push(vec4((i+1)*this.scaleX, this.landscape.getH(i+1, j+1)*this.scaleY, (j+1)*this.scaleZ, 1));
            
            this.colors.push(this.getColor(this.landscape.getH(i,j)));
            this.colors.push(this.getColor(this.landscape.getH(i+1,j)));
            this.colors.push(this.getColor(this.landscape.getH(i+1,j+1)));
            
            this.normals.push(this.calcNormal(i,j));            
            this.normals.push(this.calcNormal(i+1, j));
            this.normals.push(this.calcNormal(i+1, j+1));
                        
            // bottom triangle in square
            this.vertices.push(vec4(i*this.scaleX, this.landscape.getH(i,j)*this.scaleY, j*this.scaleZ, 1));
            this.vertices.push(vec4(i*this.scaleX, this.landscape.getH(i,j+1)*this.scaleY,(j+1)*this.scaleZ, 1)); 
            this.vertices.push(vec4((i+1)*this.scaleX, this.landscape.getH(i+1,j+1)*this.scaleY, (j+1)*this.scaleZ, 1));
            
            this.colors.push(this.getColor(this.landscape.getH(i,j)));
            this.colors.push(this.getColor(this.landscape.getH(i,j+1)));
            this.colors.push(this.getColor(this.landscape.getH(i+1,j+1)));

            this.normals.push(this.calcNormal(i,j));
            this.normals.push(this.calcNormal(i, j+1));
            this.normals.push(this.calcNormal(i+1, j+1));
           

        }
    }
    
    for (var i = 0; i < this.vertices.length; i++) {
        this.texCoords.push(vec2(0,0));

    }
};

fractal.prototype.getColor = function (h) {
    var color; 
    if (h === 0) {
        color = vec4(0.0, 0.7, 1.0, 1); // setting water color
    } else if (h > 0 && h < .4) {
        color = vec4(0.2, 0.3, 1.0, 1); // setting lower land color
    } else if (h >= .4 && h < .7) {
        color = vec4(0.5, 0.1, 1.0, 1) // setting upper land color
    } else if ( h >= .7) {
        color = vec4(1.0,1.0,1.0, 1); // setting peak color
    } else {
        color = vec4(.5,.5,1,1);
    }
    
    return color; 
};

fractal.prototype.calcNormal = function (i,j) {
    var cross1 = subtract(vec4((i+1)*this.scaleX, this.landscape.getH(i+1, j)*this.scaleY,j*this.scaleZ, 1), vec4((i-1)*this.scaleX, this.landscape.getH(i-1, j)*this.scaleY, j*this.scaleZ, 1));
    var cross2 = subtract(vec4(i*this.scaleX, this.landscape.getH(i, j-1)*this.scaleY, (j-1)*this.scaleZ, 1), vec4(i*this.scaleX, this.landscape.getH(i, j+1)*this.scaleY, (j+1)*this.scaleZ, 1));
    var crossed = normalize(cross(cross1, cross2));

    var final = vec4(crossed[0], crossed[1], crossed[2], 0);
    
    return final;
};
