/* Anna Neshyba
 * Water Simulator class 
 */

function Water(size) {
    this.name = "water";
    
    this.waterscape = []; 
    this.initWater(size);
        
    this.grid = size-1; 
    this.inc = 0.1; 
    
    this.numTriangles = this.grid * this.grid * 2; 
    this.numVertices = this.numTriangles * 3;


    this.vertices = [];
    this.normals = [];
    this.colors = [];
    this.texCoords = []; 
    
    this.makeTriangles(); 
        
}

Water.prototype.initWater = function (size) {
    
    console.log("Water heights:");

    for (var i = 0; i < size; i++) {
        var row = []; 
        for (var j = 0; j < size; j++) {
            var arr = [];
            if (i%4===0 && j%4===0) {
                arr.push(1);
                arr.push(-.01);
            } else {
                arr.push(0);
                arr.push(.01);
            }
            row.push(arr);
        }
        this.waterscape.push(row);
    }
    
    for (var i = 0; i < 10; i++) {
        var randx = Math.floor(Math.random() * size);
        var randy = Math.floor(Math.random() * size);
        
        this.waterscape[randx][randy][0] = 1;
        this.waterscape[randx][randy][1] = -.01; 
    }
    
    console.log(this.waterscape);
    
};

Water.prototype.getH = function (i, j) {
    w = this.grid + 1;  // length of array side
    i = i % w;
    j = j % w;
    if (i < 0) i += w;
    if (j < 0) j += w;
    return this.waterscape[i][j][0];
};

Water.prototype.calcNormal = function (i,j) {
    var cross1 = subtract(vec4((i+1), this.getH(i+1, j),j, 1), vec4((i-1), this.getH(i-1, j), j, 1));
    var cross2 = subtract(vec4(i, this.getH(i, j-1), (j-1), 1), vec4(i, this.getH(i, j+1), (j+1), 1));
    var crossed = normalize(cross(cross1, cross2));

    var final = vec4(crossed[0], crossed[1], crossed[2], 0);
    
    return final;
};

Water.prototype.wave = function (i,j) {
    this.waterscape[i][j][0] = this.waterscape[i][j][0] + this.waterscape[i][j][1];
    if (this.waterscape[i][j][0] < 0 || this.waterscape[i][j][0] > 1) {
        this.waterscape[i][j][1] = -this.waterscape[i][j][1];
    }
};

Water.prototype.motion = function () {
    for (var i = 0; i < this.grid; i++) {
        for (var j = 0; j < this.grid; j++) {
            this.wave(i,j);
        }
    }
    this.vertices = []; 
    this.colors = []; 
    this.normals = []; 
    this.texCoords = []; 
    
    this.makeTriangles(); 
    console.log(this.waterscape);
};

Water.prototype.makeTriangles = function () {
    
    for (var i = 0; i < this.grid; i++) {
        for (var j = 0; j < this.grid; j++ ) {
            
            // bottom triangle in square
            this.vertices.push(vec4(i, this.getH(i,j), j, 1));
            this.vertices.push(vec4((i+1), this.getH(i+1,j), j, 1));
            this.vertices.push(vec4((i+1), this.getH(i+1,j+1), j+1, 1));
            
            this.colors.push(vec4(0.2,0.5,1.0,1.0));
            this.colors.push(vec4(0.2,0.5,1.0,1.0));
            this.colors.push(vec4(0.2,0.5,1.0,1.0));
            
            this.normals.push(this.calcNormal(i,j));            
            this.normals.push(this.calcNormal(i+1, j));
            this.normals.push(this.calcNormal(i+1, j+1));
                        
            // top triangle in square
            this.vertices.push(vec4(i, this.getH(i,j), j,  1));
            this.vertices.push(vec4(i, this.getH(i,j+1),j+1, 1)); 
            this.vertices.push(vec4(i+1, this.getH(i+1,j+1), j+1, 1));
            
            this.colors.push(vec4(0.2,0.5,1.0,1.0));
            this.colors.push(vec4(0.2,0.5,1.0,1.0));
            this.colors.push(vec4(0.2,0.5,1.0,1.0));

            this.normals.push(this.calcNormal(i,j));
            this.normals.push(this.calcNormal(i, j+1));
            this.normals.push(this.calcNormal(i+1, j+1));
           

        }
    }
    
    for (var i = 0; i < this.vertices.length; i++) {
        this.texCoords.push(vec2(0,0));

    }
};
