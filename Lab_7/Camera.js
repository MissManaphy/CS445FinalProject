/**
 * Contains all of the parameters needed for controlling the camera.
 * @return {Camera}
 */
function Camera() {

    this.fov = 60;           // Field-of-view in Y direction angle (in degrees)
    this.zNear = 0.1;        // camera's far plane
    this.zFar = 500;         // camera's near plane

// Camera *initial* location and orientation parameters
    this.eye_start = vec4([0, 4, 25, 1]); // initial camera location (needed for reseting)   
    this.VPN = vec4([0, 0, 1, 0]);  // used to initialize uvn
    this.VUP = vec4([0, 1, 0, 0]);  // used to initialize uvn  

// Current camera location and orientation parameters
    this.eye = vec4(this.eye_start);     // camera location
    this.viewRotation;  // rotational part of matrix that transforms between World and Camera coord   

    this.calcUVN();  // initializes viewRotation
}

/**
 * Reset the camera location and orientation
 * @return none
 */
Camera.prototype.reset = function () {
    this.eye = vec4(this.eye_start);
    this.calcUVN();
};

/**
 * Calculate the *initial* viewRotation matrix of camera
 * based on VPN and VUP
 * @return none
 */
Camera.prototype.calcUVN = function () {
    this.viewRotation = mat4(1);  // identity - placeholder only

// TO DO:  COMPLETE THIS CODE---DONE
    var n = vec4(normalize(this.VPN, true));
    var u = vec4(normalize(cross(n, this.VUP), true), 0);
    
    this.n = n;

    var v = vec4(normalize(cross(u, n), true), 0);
    
    var R1 = [u,v, negate(n), vec4(0,0,0,1)];
    
    this.viewRotation = R1;
    
    console.log("View Rotation Matrix: ");
    printm(this.viewRotation);
    
    this.viewRotation.matrix = true;
};

/**
 * Calculate the camera's view matrix given the 
 * current eye and viewRotation
 * @return view matrix (mat4)
 */
Camera.prototype.calcViewMat = function () {
    var mv = mat4(1);  // identity - placeholder only
    //
// TO DO:  COMPLETE THIS CODE---DONE
   var eyeTranslate = translate(this.eye[0], this.eye[1], this.eye[2]);
   
   var mv = mult(this.viewRotation, eyeTranslate);
   console.log("View Matrix: ");
   printm(mv);
   return mv;
};

/** 
 * Calculate the camera's projection matrix. Here we 
 * use a perspective projection.
 * @return the projection matrix
 */
Camera.prototype.calcProjectionMat = function () {
    aspect = canvas.width/2 / canvas.height;
    return perspective(this.fov, aspect, this.zNear, this.zFar);
};

/**
 * Update the camera's eye and viewRotation matrices 
 * based on the user's mouse actions
 * @return none
 */
Camera.prototype.motion = function () {

    switch (mouseState.action) {
        case mouseState.actionChoice.TUMBLE:  // left mouse button
            // amount of rotation around axes 
            var dy = -0.05 * mouseState.delx;  // angle around y due to mouse drag along x
            var dx = -0.05 * mouseState.dely;  // angle around x due to mouse drag along y

            var ry = rotateY(10 * dy);  // rotation matrix around y
            var rx = rotateX(10 * dx);  // rotation matrix around x

//          TO DO: NEED TO IMPLEMENT TUMBLE FUNCTION
            this.tumble(rx, ry);   //  <----  NEED TO IMPLEMENT THIS FUNCTION BELOW!!!
            mouseState.startx = mouseState.x;
            mouseState.starty = mouseState.y;
            break;
        case mouseState.actionChoice.TRACK:  // PAN   - right mouse button
            var dx = -0.05 * mouseState.delx; // amount to pan along x
            var dy = 0.05 * mouseState.dely;  // amount to pan along y
            //
            //  TO DO: NEED TO IMPLEMENT HERE--DONE
            
            this.eye = add(this.eye,scale(-dx,this.viewRotation[0]));
            this.eye = add(this.eye,scale(-dy,this.viewRotation[1]));
            
            mouseState.startx = mouseState.x;
            mouseState.starty = mouseState.y;
            break;
        case mouseState.actionChoice.DOLLY:   // middle mouse button
            var dx = 0.05 * mouseState.delx;  // amount to move backward/forward
            var dy = 0.05 * mouseState.dely;
            
            //   TO DO: NEED TO IMPLEMENT HERE--DONE

            this.eye = add(this.eye,scale(dx,this.viewRotation[2]));
            this.eye = add(this.eye,scale(-dy,this.viewRotation[2]));
            
            //  Calculate this.eye
            mouseState.startx = mouseState.x;
            mouseState.starty = mouseState.y;
            break;
        default:
            console.log("unknown action: " + mouseState.action);
    }
    render();
};

/**
 * Rotate about the world coordinate system about y (left/right mouse drag) and/or 
 * about a line parallel to the camera's x-axis and going through the WCS origin 
 * (up/down mouse drag).
 * @param {mat4} rx  rotation matrix around x
 * @param {mat4} ry  rotation matrix around y
 * @return none
 */
Camera.prototype.tumble = function (rx, ry) {
    // TO DO:  IMPLEMENT THIS FUNCTION
    // We want to rotate about the world coordinate system along a direction parallel to the
    // camera's x axis. We first determine the coordinates of the WCS origin expressed in the eye coordinates.
    // We then translate this point to the camera (origin in camera coordinates) and do a rotation about x.
    // We then translate back. The result is then composed with the view matrix to give a new view matrix.
    //  When done, should have new value for eye and viewRotation

    // DO THIS CONTROL LAST - IT IS THE MOST DIFFICULT PART
    tumblePoint = vec4(0, 0, 0, 1);
    var view = this.calcViewMat();  // current view matrix
    
    // doing for later calculations
    var pPrime = mult(view, tumblePoint);
    
    var nPP = negate(pPrime);    
    var nTP = negate(tumblePoint);
    
    var translatePPN = translate(nPP[0], nPP[1], nPP[2]);
    var translatePPP = translate(pPrime[0], pPrime[1], pPrime[2]);

    var translatePN = translate(nTP[0], nTP[1], nTP[2]);
    var translatePP = translate(tumblePoint[0], tumblePoint[1], tumblePoint[2]);
    
    // X Rotate about tumble point in Camera Coord Sys
    var viewRotX = mult(rx, translatePPN);
    viewRotX = mult(translatePPP, viewRotX); 
    
    // Y Rotate about tumble point in WCS
    var viewRotY = mult(ry, translatePN);
    viewRotY = mult(translatePP, viewRotY); 
    
console.log("Eye before calc: ");
    console.log(this.eye);
    
    console.log("View: ");
    printm(view);
    
    console.log("RY");
    printm(ry);
    
    console.log("View Rot Y: ");
    printm(viewRotY);

    
    // Calculate V new
    var viewNew = mult(view, viewRotY);
    viewNew = mult(viewRotX, viewNew); 

    
    console.log("View New: ");
    printm(viewNew);

    // Extract VrotNew
    var vRotNew = mat4Copy(viewNew);
    vRotNew[0][3] = 0; 
    vRotNew[1][3] = 0; 
    vRotNew[2][3] = 0;
    
   this.viewRotation = vRotNew;

    console.log("View Rot New: ");
    printm(vRotNew);
        
    // need to get eye position back
    var vRotNewT = transpose(vRotNew);
    var tEye = mult(vRotNewT, viewNew);
    
    console.log("tEye:");
    printm(tEye);
    
    this.eye[0] = tEye[0][3];
    this.eye[1] = tEye[1][3];
    this.eye[2] = tEye[2][3];
    
    console.log("Eye: ");
    console.log(this.eye);

};

Camera.prototype.keyAction = function (key) {
    var alpha = 1.0;  // used to control the amount of a turn during the flythrough 
    switch (key) {     // different keys should be used because these do thing sin browser
        case 'W':  // turn right - this is implemented
            console.log("turn right");
            this.viewRotation = mult(rotateY(alpha), this.viewRotation);
            break;
        case 'E':   // turn left
            console.log("turn left");
            this.viewRotation = mult(rotateY(-alpha), this.viewRotation);
            break;
        case 'S':  // turn up   
            console.log(" turn up");
            this.viewRotation = mult(rotateX(alpha), this.viewRotation); 
            break;
        case 'D':  // turn down
            console.log("turn down");
            this.viewRotation = mult(rotateX(-alpha), this.viewRotation); 
            break;
        case 'X':  // bank right
            console.log("bank right");
            this.viewRotation = mult(rotateZ(alpha), this.viewRotation); 
            break;
        case 'C':  // bank left
            console.log("bank left");
            this.viewRotation = mult(rotateZ(-alpha), this.viewRotation); 
            break;
        case 'Q':  // move forward
            console.log("move forward");
            
            this.eye = add(this.eye,scale(0.05,this.viewRotation[2]));

            // find associated height
            var tempI = Math.round((-this.eye[0]+scaleXG/2)*frac.gridSize/scaleXG);
            var tempJ = Math.round((-this.eye[2]+scaleZG/2)*frac.gridSize/scaleZG);
            
            console.log(tempI);
            console.log(tempJ);
            
            // if on the fractal map, reset the y coordinate to scaled height
            this.eye[1] = -(frac.getH(tempI,tempJ)*scaleYG+.5);
            
            break;
        case 'A':  //  move backward
            console.log("move backward");
            this.eye = add(this.eye,scale(-0.05,this.viewRotation[2]));

            // find associated height
            var tempI = Math.round((-this.eye[0]+scaleXG/2)*frac.gridSize/scaleXG);
            var tempJ = Math.round((-this.eye[2]+scaleZG/2)*frac.gridSize/scaleZG);
            
            // if on the fractal map, reset the y coordinate to scaled height
            this.eye[1] = -(frac.getH(tempI,tempJ)*scaleYG+.5);
                        
            break;
        case 'R':  //  reset
            console.log("reset");
            this.reset();
            break;
    }
};