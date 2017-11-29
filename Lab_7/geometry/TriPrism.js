/* This shape was made by Anna Neshyba
 * Triprism: 
 * bottom centered at the origin, height = 1, bottom side = 1, width = 1; 
 */

function TriPrism() {
    this.name = "triprism";
    
    this.numTriangles = 8; 
    this.numVertices = 24; 
    this.uniqueVertices = [
        // front triangle
        vec4(0,1,0.5,1.0), 
        vec4(-1,0,.5,1.0),
        vec4(1,0,.5,1.0),
        
        // back triangle
        vec4(0,1,-0.5,1.0),
        vec4(-1,0,-0.5,1.0),
        vec4(1,0,-0.5,1.0)
    ]; 
    
    this.vertices = [];
    this.colors = [];
    this.normals = [];
    this.texCoords = []; 
    
    // front 
    this.vertices.push(this.uniqueVertices[0]);
    this.vertices.push(this.uniqueVertices[1]);
    this.vertices.push(this.uniqueVertices[2]);
    
    this.normals.push(vec4(0,0,1,0));
    this.normals.push(vec4(0,0,1,0));
    this.normals.push(vec4(0,0,1,0));
    
    this.texCoords.push(vec2(0,0));
    this.texCoords.push(vec2(0,1));
    this.texCoords.push(vec2(.5,1));


    // back 
    this.vertices.push(this.uniqueVertices[3]);
    this.vertices.push(this.uniqueVertices[4]);
    this.vertices.push(this.uniqueVertices[5]);
    
    this.normals.push(vec4(0,0,-1,0));
    this.normals.push(vec4(0,0,-1,0));
    this.normals.push(vec4(0,0,-1,0));
    
    this.texCoords.push(vec2(0,0));
    this.texCoords.push(vec2(0,1));
    this.texCoords.push(vec2(.5,1));

    // Right side
    this.vertices.push(this.uniqueVertices[0]);
    this.vertices.push(this.uniqueVertices[2]);
    this.vertices.push(this.uniqueVertices[5]);
    
    this.vertices.push(this.uniqueVertices[0]);
    this.vertices.push(this.uniqueVertices[3]);
    this.vertices.push(this.uniqueVertices[5]);
    
    for (var i = 0; i < 6; i++) {
        this.normals.push(normalize(vec4(1,1,0,0)));
    }
    
    this.texCoords.push(vec2(0,1));
    this.texCoords.push(vec2(0,0));
    this.texCoords.push(vec2(1,0));
    this.texCoords.push(vec2(0,1));
    this.texCoords.push(vec2(1,1));
    this.texCoords.push(vec2(1,0));
    
    
    // Left side
    this.vertices.push(this.uniqueVertices[0]);
    this.vertices.push(this.uniqueVertices[1]);
    this.vertices.push(this.uniqueVertices[4]);
    
    this.vertices.push(this.uniqueVertices[0]);
    this.vertices.push(this.uniqueVertices[3]);
    this.vertices.push(this.uniqueVertices[4]);
    
    for (var i = 0; i < 6; i++) {
        this.normals.push(normalize(vec4(-1,1,0,0)));
    }
    
    this.texCoords.push(vec2(0,1));
    this.texCoords.push(vec2(0,0));
    this.texCoords.push(vec2(1,0));
    
    this.texCoords.push(vec2(0,1));
    this.texCoords.push(vec2(1,1));
    this.texCoords.push(vec2(1,0));
    
    // Bottom
    this.vertices.push(this.uniqueVertices[1]);
    this.vertices.push(this.uniqueVertices[2]);
    this.vertices.push(this.uniqueVertices[5]);
    
    this.vertices.push(this.uniqueVertices[1]);
    this.vertices.push(this.uniqueVertices[4]);
    this.vertices.push(this.uniqueVertices[5]);
    
    for (var i = 0; i < 6; i++ ){
        this.normals.push(normalize(vec4(-1,0,0,0)));
    }
    
    this.texCoords.push(vec2(0,1));
    this.texCoords.push(vec2(0,0));
    this.texCoords.push(vec2(1,0));
    this.texCoords.push(vec2(0,1));
    this.texCoords.push(vec2(1,1));
    this.texCoords.push(vec2(1,0));
    
    for (var i = 0; i < this.numVertices; i++) {
        this.colors.push(vec4(0.0,1.0,0.0,1.0));
    }
    
}