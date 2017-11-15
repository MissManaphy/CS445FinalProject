
function Cylinder(num_sides, height){
    
    //create two disks and connect them together
    this.name = "Cylinder";
    this.numVertices = num_sides*12; //12
    this.numTriangles = num_sides *4; //4
    this.colors = [];
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    
     // Local variables: unique vertices and colors.
    ////////////////////////////////////////////////////////////
    var color1 = vec4(0.0, 1.0, 0.0, 1.0); 
    var color2= vec4(0.0, 1.0, 0.0, 1.0);
    var color3 = vec4(1.0, 0.0, 0.0, 1.0);
    var color4 = vec4(1.0, 0.0, 1.0, 1.0); //side colors    
    
    //top disk
    var top_vertex = vec4(0, height, 0, 1); //offset of 0 makes a flat disk
    var top_vertices = [];
    //bottom disk
    var bottom_center_vertex = vec4(0, -height, 0, 1); //bottom
    var bottom_vertices = [];

    
    // C____ B
    //  |  /
    //  | /
    //  |/
    //  A
    //side, top left triangle
//    var leftC = []; //equivalent to top[i]
//    var leftA = []; //equivalent to bottom[i]
//    var leftB = []; //equivalent to top[i+1]
    
    //     A
    //    /|
    //   / |
    //B /__| C
    //  
    //side, bottom right triangle
//    var rightC = []; //equivalent to bottom[i+1]
//    var rightA = []; //equivalent top[i+1]
//    var rightB = []; //equivalent to bottom[i]
      
 
    //map out the vertices
    for(var i=0; i<num_sides;i++){
        var percentage = (2*Math.PI *i)/num_sides;
        
        var top_points = vec4(Math.cos(percentage), height, Math.sin(percentage), 1);
        var bottom_points = vec4(Math.cos(percentage), -height, Math.sin(percentage), 1);
        
        top_vertices[i] = top_points; //top disk
        bottom_vertices[i] = bottom_points; //bottom disk
    }
    
   
    //rendering
    for (var i = 0; i < num_sides; i++) {
        var percentage = (2*Math.PI *i)/num_sides;
        var percentage2 = (2*Math.PI *((i+1) % num_sides))/num_sides;
        
        //note: w val is 0 for normals
        var norm = vec4(0,1,0,0); //top disk normal
        var norm2 = vec4(Math.cos(percentage),0,Math.sin(percentage),0); //bottom disk normal
        var norm3 = vec4(Math.cos(percentage2),0,Math.sin(percentage2),0); //side face normals
        var norm4 = vec4(0,-1,0,0); //bottom disk normal

        //top disk
        p1 = top_vertex;
        p2 = top_vertices[i];
        p3 = top_vertices[(i+1) % num_sides];
        
        tex1 = vec2(0.5,0.5);
        tex2 = vec2((Math.cos(percentage))/2+.5, (Math.sin(percentage))/2+.5);
        tex3 = vec2((Math.cos(percentage2))/2+.5, (Math.sin(percentage2))/2+.5);
        
        //fill out the bottom
        p4 = bottom_center_vertex;
        p5 = bottom_vertices[i];
        p6 = bottom_vertices[(i+1) % num_sides];
        
        tex4 = vec2(0.5,0.5);
        tex5 = vec2((Math.cos(percentage))/2+.5, (Math.sin(percentage))/2+.5);
        tex6 = vec2((Math.cos(percentage2))/2+.5, (Math.sin(percentage2))/2+.5);
        
        //fill in the sides
        
        //cylinder side texCoords
        texa = vec2(i/num_sides, 0);
        texb = vec2(i/num_sides, 1);
        texc = vec2((i+1)/num_sides, 0);
        texd = vec2((i+1)/num_sides, 1);
        
       
        //left triangle
        p7 = top_vertices[i];
        p8 = bottom_vertices[i];
        p9 = top_vertices[(i+1)%num_sides];
       
        
        //right triangle
        p10 = bottom_vertices[(i+1) % num_sides];
        p11 = top_vertices[(i+1) % num_sides];
        p12 = bottom_vertices[i];
        
        this.vertices.push(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12); //will have 12
        this.normals.push(norm,norm,norm,norm4,norm4,norm4, norm2,norm2,norm3,norm3,norm3,norm2);
        this.colors.push(color1, color1, color1, color2, color2, color2, color3, color3, color3, color4, color4, color4);
        this.texCoords.push(tex1, tex2, tex3, tex4, tex5, tex6, texa, texb, texc, texb, texc, texd);
    }
}

