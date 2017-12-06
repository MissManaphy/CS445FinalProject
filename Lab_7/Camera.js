
////////////////// VERSION FOR FINAL PROJET BELOW ///////////////////



/**
 * Contains all of the parameters needed for controlling the camera.
 * @return {Camera}
 */
function Camera() {

    this.fov = 60;           // Field-of-view in Y direction angle (in degrees)
    this.zNear = 0.1;        // camera's far plane
    this.zFar = 500;         // camera's near plane

// Camera *initial* location and orientation parameters
    this.eye_start = vec4([0, -(frac.getH(0,0)*scaleYG+.5), 0, 1]); // initial camera location (needed for reseting)   
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

// TO DO:  COMPLETE THIS CODE
    var n = vec4(normalize(normalize(this.VPN), true));
    var u = cross(normalize(this.VUP),n);
    var v = cross(n,u);
    u.push(0); //append 0 to the end bc original code has vec3 instead of vec4
    v.push(0);
    this.viewRotation = [ //R^t
        u,
        v,
        n,
        [0,0,0,1],
    ];
    this.viewRotation.matrix = true;
};

/**
 * Calculate the camera's view matrix given the 
 * current eye and viewRotation
 * @return view matrix (mat4)
 */
Camera.prototype.calcViewMat = function () {
    var mv = mat4(1);  // identity - placeholder only
// TO DO:  COMPLETE THIS CODE
    var eyeTranslate = translate(-this.eye[0], -this.eye[1], -this.eye[2]); 
    var mv = mult (this.viewRotation, eyeTranslate); 
    return mv; 
};

/** 
 * Calculate the camera's projection matrix. Here we 
 * use a perspective projection.
 * @return the projection matrix
 */
Camera.prototype.calcProjectionMat = function () {
    aspect = .5*canvas.width / canvas.height;
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
            //var dx = -0.05 * mouseState.dely;  // angle around x due to mouse drag along y
            var dx = 0;
            

            var ry = rotateY(10 * dy);  // rotation matrix around y //10 is the rotation increment
            var rx = rotateX(10 * dx);  // rotation matrix around x

            this.tumble(rx, ry);   //  <----  NEED TO IMPLEMENT THIS FUNCTION BELOW!!!
            
            mouseState.startx = mouseState.x;
            mouseState.starty = mouseState.y;
            break;
            
        case mouseState.actionChoice.TRACK:  // PAN   - right mouse button
            //var dx = -0.05 * mouseState.delx; // amount to pan along x
            //var dy = 0.05 * mouseState.dely;  // amount to pan along y
            
            var dy = 0;
            var dx = 0;
            
              var an = add(scale(dx, this.viewRotation[0]),
              scale(dy, this.viewRotation[1])); //alpha * n
            this.eye = add(this.eye, an); //order matters with subtract
            mouseState.startx = mouseState.x;
            mouseState.starty = mouseState.y;
            break;
            
        case mouseState.actionChoice.DOLLY:   // middle mouse button
            var dx = 0.05 * mouseState.delx;  // amount to move backward/forward
            var dy = 0.05 * mouseState.dely;

            var an = scale(dy, this.viewRotation[2]); //alpha * n
            this.eye = subtract(this.eye, an); //order matters with subtract
            mouseState.startx = mouseState.x;
            mouseState.starty = mouseState.y;
            break;
            
        //case mouseState.actionChoice.TELEPORT: // t+ any click on the right hand side of the screen
        
            
        default:
            console.log("unknown action: " + mouseState.action);
    }
    render();
};

function make_rounded_matrix_string (m) { 
	var flat = flatten (m); // Make a 1D array for easier working with it (to avoid recursion, etc.) 
	var result = []; 
	for (var i = 0; i < flat.length; i++) { 
		var roundString = "" + (Math.round (flat[i] * 100)); // Round everything to the nearest 0.01 
		var isNegative = roundString.charAt (0) == '-'; 
		if (isNegative) 
			roundString = roundString.substring (1); // Take out the leading '-' (required before adding leading 0s). 
		while (roundString.length < 3) roundString = "0" + roundString; // Add leading 0s if necessary (so, 001 rather than 1, etc.). 
		// And the result is to change "001" to "0.01", "4834" to "48.34", etc. --> so add a "." before the last two digits: 
		result.push ((isNegative ? "-" : "") + roundString.substring (0, roundString.length - 2) + "." + roundString.substring (roundString.length - 2)); 
	} 
	return result.toString (); 
} 

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
	var view_old = this.calcViewMat ();  // current view matrix
	
	var pc = this.eye; //vec4 (0,0,0,1); //origin, point about which to rotate 
	var pcPrime = mult (view_old, pc); 
	
	
	// Vnew = T(Pc’) Rx T(-Pc’) Vold T(Pc) Ry T(-Pc) --------------- from the notes (CoordinateSystems.pdf) 
	var view_new = multAll (
		translate (pcPrime[0], pcPrime[1], pcPrime[2]), 
		rx, 
		translate (-pcPrime[0], -pcPrime[1], -pcPrime[2]), 
		view_old, 
		translate (pc[0], pc[1], pc[2]), 
		ry, 
		translate (-pc[0], -pc[1], -pc[2]) 
	); 
	
	var rotate_inverse = transpose (view_new); // The inverse is just the transpose (assuming we take out the right column, which will be the bottom row after transpose ...) 
	rotate_inverse[3] = vec4 (0, 0, 0, 1); // Take out the translate component by resetting the bottom row (i.e., used to be right column). 
	
	this.viewRotation = transpose (rotate_inverse); // Transpose again to get the original rotation thing. 
//	console.log (make_rounded_matrix_string (this.viewRotation)); //for debugging purposes
	
	// need to get eye position back
	//  Here, rotInverse is the inverse of the rotational part of the view matrix.
	//  eye = -rotInverse*view*origin  -> this gives the location of the WCS origin in the eye coordinates
	var eye_translate = mult (rotate_inverse, view_new); 
	this.eye = vec4 (-eye_translate[0][3], -eye_translate[1][3], -eye_translate[2][3], 1); 
};

Camera.prototype.keyAction = function (key) {
    var alpha = 10.0;  // used to control the amount of a turn during the flythrough 
    var s = 1;
    switch (key) {     // different keys should be used because these do thing sin browser
        case 'A':  // turn right - this is implemented
            console.log("turn right");
            this.viewRotation = mult(rotateY(alpha), this.viewRotation);
            break;
        case 'D':   // turn left
            console.log("turn left");

            this.viewRotation = mult(rotateY(-alpha), this.viewRotation);
            break;
        case 'W':  // move forward
            console.log("move forward");
            
            // setting regular location 
            this.eye = add(this.eye,scale(0.05,this.viewRotation[2]));

            // find associated height
            var tempI = Math.round(-this.eye[0]/scaleXG);
            var tempJ = Math.round(-this.eye[2]/scaleZG);
            
            // if on the fractal map, reset the y coordinate to scaled height
            if ((-this.eye[0] > 0 && -this.eye[0] < totalX) && (-this.eye[2] > 0 && -this.eye[2] < totalZ)) {
                this.eye[1] = -(frac.getH(tempI,tempJ)*scaleYG+.5);
            }
            break;
        case 'S':  //  move backward
            console.log("move backward");
            
            // setting regular location 
            this.eye = add(this.eye,scale(-0.05,this.viewRotation[2]));

            // find associated height
            var tempI = Math.round(-this.eye[0]/scaleXG);
            var tempJ = Math.round(-this.eye[2]/scaleZG);
            
            // if on the fractal map, reset the y coordinate to scaled height
            if ((-this.eye[0] > 0 && -this.eye[0] < totalX) && (-this.eye[2] > 0 && -this.eye[2] < totalZ)) {
                this.eye[1] = -(frac.getH(tempI,tempJ)*scaleYG+.5);
            }
            break;
        case 'R':  //  reset
            console.log("reset");
            this.reset();
            break;
    }
};