var canvas;       // HTML 5 canvas
var gl;           // webgl graphics context
var vPosition;    // shader variable attrib location for vertices 
var vColor;       // shader variable attrib location for color
var uColor;       // shader uniform variable location for color
var uProjection;  //  shader uniform variable for projection matrix
var uModel_view;  //  shader uniform variable for model-view matrix
var vNormal;      //shader variable for vertex normals
var vTexture;     //the thing for the texture coordinates
var uTexture;

var thetaX = 0;
//var lightAngle = document.getElementById("slider").value; //takes an input from slider to calculate x,z 
//console.log(lightAngle);

var camera = new Camera(); 
var stack = new MatrixStack();
var light1 = new Lighting();
var program;

var checkerboard;
var target;
var noManPardon;
var mission;
var static; 

window.onload = function init()
{   
    //set Event Handlers
    setKeyEventHandler();
    setMouseEventHandler();
    rotY();
    
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
    checkerboard = new Checkerboard();
    target = new ImageTexture("../Common/textures/test.jpg");
    noManPardon = new ImageTexture("../Common/textures/noManPardon.png");
    mission = new ImageTexture("../Common/textures/MissionStatus.png");
    static = new Static();
    
    
    

    light1.positionY(0); //takes in rotation about y axis, sets light position
    light1.setUp();
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
    vColor = gl.getAttribLocation(program, "vColor"); 
    vTexture = gl.getAttribLocation(program, "vTexture");
                            // colors but we keep it in for possible use later.
    vNormal = gl.getAttribLocation(program, "vNormal");
   
    // get handles for shader uniform variables: 
    uColor = gl.getUniformLocation(program, "uColor");  // uniform color
    uTexture = gl.getUniformLocation(program, "uTexture");
    uProjection = gl.getUniformLocation(program, "uProjection"); // projection matrix
    uModel_view = gl.getUniformLocation(program, "uModel_view");  // model-view matrix
    
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projMat = camera.calcProjectionMat();   // Projection matrix  
    gl.uniformMatrix4fv(uProjection, false, flatten(projMat));
    
    var viewMat = camera.calcViewMat();   // View matrix
    var lightshade = mult(viewMat, light1.light_position ); //is a vector
    gl.uniform4fv(uLight_position, lightshade); // camera coordinate system
    
    stack.clear();
    stack.multiply(viewMat);
    
    // Need these 2 lines since camera is sitting at origin. 
    // Without them, you would be sitting inside the cube.
    // REMOVE once camera controls are working
    // stack.multiply(translate(0, 0, -10)); 
    // gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
   
    //stack.push();
    
   ////// creating cube
    stack.push();  
    stack.multiply(translate(0, 1, 0));
    stack.multiply(scalem(3, 3, 3));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    static.activate();
    gl.uniform1i(gl.getUniformLocation(program, "uColorMode"), 0);
    //gl.uniform4fv(uColor, vec4(.5, .5, 1.0, 1.0));
    Shapes.drawPrimitive(Shapes.cube);
    
    stack.pop();
    /////end cube
    
    ////// creating disk
    stack.push();  
    stack.multiply(translate(-5, 1, 0));
    stack.multiply(scalem(3, 3, 3));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    noManPardon.activate();
    gl.uniform1i(gl.getUniformLocation(program, "uColorMode"), 0);
    //gl.uniform4fv(uColor, vec4(.5, .5, 1.0, 1.0));
    Shapes.drawPrimitive(Shapes.disk);
    
    stack.pop();
    ////end disk
    
    ////// creating cone
    stack.push();  
    stack.multiply(translate(5, 1, 0));
    stack.multiply(scalem(3, 3, 3));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    mission.activate();
    gl.uniform1i(gl.getUniformLocation(program, "uColorMode"), 2);
    //gl.uniform4fv(uColor, vec4(.5, .5, 1.0, 1.0));
    Shapes.drawPrimitive(Shapes.cone);
    
    stack.pop();
    ////end cone
    
    /////////
    stack.push();  
    stack.multiply(translate(0, 0, -7));
    stack.multiply(scalem(.5, .5, .5)); 
    gl.uniform1i(gl.getUniformLocation(program, "uColorMode"), 0);
    static.activate();
    myScene();
    stack.pop();
    /////////
    stack.push();  
    stack.multiply(translate(-5, 0, -7));
    stack.multiply(scalem(.5, .5, .5));
    gl.uniform1i(gl.getUniformLocation(program, "uColorMode"), 0);
    noManPardon.activate();
    myScene();
    stack.pop();
    /////////
    stack.push();  
    stack.multiply(translate(5, 0, -7));
    stack.multiply(scalem(.5, .5, .5));
    gl.uniform1i(gl.getUniformLocation(program, "uColorMode"), 2);
    mission.activate();
    myScene();
    stack.pop();
    /////////
    stack.push();  
    stack.multiply(translate(10, 0, -7));
    stack.multiply(scalem(.5, .5, .5));
    gl.uniform1i(gl.getUniformLocation(program, "uColorMode"), 1);
    target.activate();
    myScene();
    stack.pop();
    /////////
    
    ////// creating cylinder
    stack.push();  
    stack.multiply(translate(10, 1, 0));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    target.activate();
    gl.uniform1i(gl.getUniformLocation(program, "uColorMode"), 3);
    //gl.uniform4fv(uColor, vec4(.5, .5, 1.0, 1.0));
    Shapes.drawPrimitive(Shapes.cylinder);
    
    stack.pop();
    ////end cylinder
    
    
    // light cube
    stack.push();
    var Lposition = vec3(light1.x_pos, light1.y_pos, light1.z_pos);

    viewMat = mult(viewMat, translate(Lposition)); // update modelview transform
    viewMat = mult(viewMat, scalem(.25,.25,.25));   // small cube
    
    gl.uniformMatrix4fv(uModel_view, false, flatten(viewMat)); // set view transform
    gl.uniform4fv(uColor, vec4(0.0, 0.0, 0.0, 1.0));  // set color to green
    Shapes.drawPrimitive(Shapes.cube);  // draw cube
    
    //ground
    stack.multiply(translate(0, -1, 0));
    stack.multiply(scalem(50, 1, 50));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform4fv(uColor, vec4(0.0, 1.0, 1.0, 1.0)); 
    checkerboard.activate();
    gl.uniform1i(gl.getUniformLocation(program, "uColorMode"), 0);
    Shapes.drawPrimitive(Shapes.cube);
    
    stack.pop();
   
}

function myScene(){ //cubes and other primitives on the ground
    var unicycle1 = new Unicycle();
    unicycle1.drawUnicycle();
    
    
}

