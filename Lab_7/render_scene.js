// Anna Neshyba & Sophia Anderson Final

var canvas; 
var gl;           // webgl graphics context

var vPosition;    // shader variable attrib location for vertices 
var vColor;       // shader variable attrib location for color
var vNormal;	  // shader variable attrib normals for vertices
var vTexCoords; 

var uColor;       // shader uniform variable location for color
var uProjection;  //  shader uniform variable for projection matrix
var uModel_view;  //  shader uniform variable for model-view matrix
var uTexture; 

var uColorMode;  //for choosing which kind of color to use



var camera = new Camera(); 
var stack = new MatrixStack();
var lighting = new Lighting();
var program;

var dotLocation; 

// textures
var clouds; 

//variables for navigation
var frac;
var scaleXG = 40;
var scaleYG = 7;
var scaleZG = 40;
var scalG; 
var totalX = scaleXG;
var totalZ = scaleZG;



window.onload = function init()
{   
    //set Event Handlers
    setKeyEventHandler();
    setMouseEventHandler();
    
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.309, 0.505, 0.74, 1.0);
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    shaderSetup();
    
    Shapes.initShapes();  // create the primitive and other shapes 
    //
    //Initalizing different textures
    clouds = new ImageTexture("textures/clouds.jpg");
    
    
    lighting.setUp();
    
    render();
};

/**
 *  Load shaders, attach shaders to program, obtain handles for 
 *  the attribute and uniform variables.
 * @return {undefined}
 */
function shaderSetup() {
    //  Load shaders
//    program = initShaders(gl, "vertex-shader", "fragment-shader");
//    gl.useProgram(program);

    // get handles for shader attribute variables. 
    // We will need these in setting up buffers.
    vPosition = gl.getAttribLocation(program, "vPosition");
    vColor = gl.getAttribLocation(program, "vColor"); // we won't use vertex here
    vNormal = gl.getAttribLocation(program, "vNormal");
    vTexCoords = gl.getAttribLocation(program, "vTexCoords");
                          // colors but we keep it in for possible use later.
   
    // get handles for shader uniform variables: 
    uColor = gl.getUniformLocation(program, "uColor");  // uniform color
    uProjection = gl.getUniformLocation(program, "uProjection"); // projection matrix
    uModel_view = gl.getUniformLocation(program, "uModel_view");  // model-view matrix
    uTexture = gl.getUniformLocation(program, "uTexture");  // model-view matrix
    //
    // setting color 
    uColorMode = gl.getUniformLocation(program, "uColorMode");
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Left perspective window render
    var projMat = camera.calcProjectionMat();   // Projection matrix  
    gl.uniformMatrix4fv(uProjection, false, flatten(projMat));
    var viewMat = camera.calcViewMat();   // View matrix
    gl.viewport(0,0,canvas.width/2, canvas.height); //viewport of this camera
    
    dotLocation = vec3(-camera.eye[0], (-camera.eye[1]+5), -camera.eye[2]);
    
    render1(viewMat); //rendering this with perspective view
    
    //Right perspective window render
    projMat = ortho(-20,20,-20,20,1,2000);
    gl.uniformMatrix4fv(uProjection, false, flatten(projMat));
    viewMat = lookAt(vec3(0, 10, 0), vec3(0,0,0), vec3(1,0,0));   // View matrix
    gl.viewport(canvas.width/2,0,canvas.width/2, canvas.height); //viewport of this camera
    
    render1(viewMat);// rendering this with orthographic view
}

function render1(viewMat)
{
    var newlight = mult(viewMat, lighting.light_position ); //is a vector
    gl.uniform4fv(uLight_position, newlight); // camera coordinate system
    
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));

    stack.clear();
    stack.multiply(viewMat);
    
    // Need these 2 lines since camera is sitting at origin. 
    // Without them, you would be sitting inside the cube.
    // REMOVE once camera controls are working
    // stack.multiply(translate(0, 0, -10)); 
    // gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
  
    stack.push(); 
        gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));

    //Shapes.axis.draw();
    stack.pop(); 
    
    // light cube
    stack.push();
    stack.multiply(translate(lighting.light_position[0], lighting.light_position[1], lighting.light_position[2]));
    stack.multiply(scalem(1/5,1/5,1/5));
    gl.uniform4fv(uColor, vec4(0.0, 1.0, 0.0, 1.0)); 
    gl.uniform1i(uColorMode, 0); 
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop(); 
    
    // location dot
    stack.push();
    stack.multiply(translate(dotLocation));
    stack.multiply(scalem(1/2,1/2,1/2));
    gl.uniform4fv(uColor, vec4(1.0,0,0,1.0)); 
    gl.uniform1i(uColorMode, 1); 
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    Shapes.drawPrimitive(Shapes.sphere);
    stack.pop(); 
    
   // drawing fractal  
    stack.push();
    stack.multiply(translate(-scaleXG/2, 0, -scaleZG/2));
    stack.multiply(scalem(scaleXG, scaleYG, scaleZG));
    gl.uniform4fv(uColor, vec4(0.6, 0.2, 0.8, 1.0)); 
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1i(uColorMode, 3);
    Shapes.drawPrimitive(Shapes.fractal1);
    stack.pop();
    

    
 
}