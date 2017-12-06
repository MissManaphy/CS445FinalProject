/* 
 * Lab 8: Final Project
 * Sophia Anderson
 * Oct 27, 2017
 */


function Fractal(grid){
    
    this.landscape = new IslandGenerator(grid);
    this.name = "Fractal";
    this.numTriangles = 2*(this.landscape.gridSize*this.landscape.gridSize);
    this.numVertices = 3*this.numTriangles;
    this.colors = [];
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    
    var x = this.landscape.gridSize;
    var z = this.landscape.gridSize;
    
    //calculate the verticies all at once, push into verticies stack
    //use them to calculate the normals all at once, push onto normals stack 
    //use heights at each vertex (take data from FractalDEM) to calculate color, push onto colors stack

    var scal = grid**2;
    

    //calculate the verticies all at once, push into verticies stack
        /*The Grid
     *       x
     *  ———————————
     * |__|__|__|__|
     * |__|__|__|__| z
     * |__|__|__|__|
     * |__|__|__|__|
     * 
     * A Single Square
     * a__d
     * |\ |
     * |_\|
     * b   c
     * 
     * If you have the verticies of each grid square labled as above
     * then you calculate the verticies for the triangles (first by row then by column)
     * you start at the point [i][j] (aka [0][0])
     * then you find the point by getting its x(as defined by the grid)
     * it's height(as defined by the random generation 2d array), 
     * and its z(as defined by the grid)
     * the you define the triangles as tri1 = a,b,c and tri2 = a,c,d
     * then you push all those points onto the array
     * then you move onto the next square!
     */
    for(var i=0; i<z; i++)
    {
        for (var j =0; j<x; j++){
            
            var a = vec4(j/scal,(this.landscape.getH(j,i)),i/scal, 1); //Point A
            var colorA = this.colorCalc(a[1]); //Calculating color based on height

            //Start Calculating Normal A
            var normA = this.normCalc(a[0],a[2], scal);
            //End Calculating Normal A

                    
            //----------------------------------------------
            var b = vec4(j/scal,(this.landscape.getH(j,i+1)),(i+1)/scal, 1); //Point B
            var colorB = this.colorCalc(b[1]); //Calculating color based on height

            //Start Calculating Normal B
            var normB = this.normCalc(b[0],b[2], scal);
            //End Calculating Normal B

           //----------------------------------------------
            var c = vec4((j+1)/scal,(this.landscape.getH(j+1,i+1)),(i+1)/scal, 1); //Point C
            var colorC = this.colorCalc(c[1]); //Calculating color based on height

            //Start Calculating Normal C
            var normC = this.normCalc(c[0],c[2], scal);
            //End Calculating Normal C
            
            //----------------------------------------------
            var d = vec4((j+1)/scal,(this.landscape.getH(j+1,i)),i/scal, 1);//Point D
            var colorD = this.colorCalc(d[1]);
            
            //Start Calculating Normal D
            var normD = this.normCalc(d[0],d[2], scal);
            //End Calculating Normal D
            
            //Push verticies and normals
            this.vertices.push(a,b,c,a,c,d);
            this.normals.push(normA,normB,normC,normA,normC,normD);
            this.colors.push(colorA, colorB, colorC, colorA, colorC, colorD);
            this.texCoords.push(vec2(0,0), vec2(0,0), vec2(0,0), vec2(0,0), vec2(0,0), vec2(0,0));
            
            
        }
    }  
}


Fractal.prototype.colorCalc = function (height) {
    var color = vec4(0.0, 0.0, 0.0, 1.0);
    var div = 255;
    //colors can be entered in standard rgb 0-255 format, just divide all numbers by div
    if (height >= 0.7){ // this is mountian peaks
        color = vec4(244/div, 245/div, 247/div,1.0);
    }

    if ((height >= 0.55) && (height < 0.7)){ //darker rocky mountian area
        color = vec4(196/div, 185/div, 172/div,1.0);
    }
    
    if ((height >= 0.3) && (height < 0.55)){ //evergreen forests
        color = vec4(99/div, 168/div, 99/div,1.0);
    }
    if ((height >= 0.1) && (height < 0.3)){ //lighter deciduous forests
        color = vec4(130/div, 224/div, 130/div, 1.0);
    }
    if ((height >= 0.05) && (height < 0.1)){ //dark, fertile soil
        color = vec4(124/div, 118/div, 91/div,1.0);
    }
    if ((height > 0) && (height < 0.05)){ //sand
        color = vec4(224/div, 217/div, 186/div,1.0);
    }
    if (height === 0){ //water
        color = vec4(29/div, 75/div, 193/div,1.0);
    }
        
    return color;
};

Fractal.prototype.normCalc = function (x,z,sc){
    x = Math.round(x*sc);
    z = Math.round(z*sc);

    var xleft = vec4(x/sc, (this.landscape.getH(x,z-1)), (z-1)/sc, 1);
    var xright = vec4(x/sc, (this.landscape.getH(x,z+1)), (z+1)/sc, 1);
    var zdown = vec4((x+1)/sc, (this.landscape.getH(x+1,z)), z/sc, 1);
    var zup = vec4(x-1/sc, (this.landscape.getH(x-1,z)), z/sc, 1);

    var horiz = vec4(xleft[0]-xright[0],xleft[1]-xright[1],xleft[2]-xright[2]);  //subtract(xleft, xright);
    var vert = vec4(zdown[0]-zup[0], zdown[1]-zup[1], zdown[2]-zup[2]);
            
    var norm = cross(horiz, vert);
    
    norm = normalize(vec4(norm[0], norm[1], norm[2], 0));
    return norm;
};

