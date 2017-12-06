/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Disk(num_divisions){ //num division determines resolution and number of triangles
    
    //var num_divisions = 8; //triangles
    this.name = "Disk";
    this.numVertices = num_divisions*3;
    this.numTriangles = num_divisions;
    this.colors = [];
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    
     // Local variables: unique vertices and colors.
    ////////////////////////////////////////////////////////////
    
    var center_vertex = vec4(0, 0, 0, 1); //offset from center, default 0

    var outside_vertices = [];
       
    //put vertices in a their location
    for(var i=0; i<num_divisions;i++){
        var percentage = (2*Math.PI*i)/num_divisions;
        var newpoint = vec4(Math.cos(percentage), 0, Math.sin(percentage));
        outside_vertices[i] = newpoint;
    }

    var color = vec4(0.0, 0.0, 1.0, 1.0); // blue
    
    //color in triangles
    for (var i = 0; i < num_divisions; i++) {
        
        var percentage = (2*Math.PI*i)/num_divisions;
        var percentage2 = (2*Math.PI*(i+1))/num_divisions;
        
        
        var norm = vec4(0,1,0,0);
        
        p1 = center_vertex;
        p2 = outside_vertices[i];
        p3 = outside_vertices[(i+1) % num_divisions];
      
        percentage; 
        tex1 = vec2(0.5,0.5);
        tex2 = vec2((Math.cos(percentage))/2+.5, (Math.sin(percentage))/2+.5);
        tex3 = vec2((Math.cos(percentage2))/2+.5, (Math.sin(percentage2))/2+.5);

        this.vertices.push(p1, p2, p3);
        this.normals.push(norm, norm, norm);
        this.colors.push(color, color, color);
        this.texCoords.push(tex1,tex2,tex3);
    }
}
