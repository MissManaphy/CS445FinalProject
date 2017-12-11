/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Cabin() {
    this.theta = 0;
    this.theta_inc = 1; 
    
    this.wallL = 10;
    this.wallN = 7;
    this.logSize = .7;
    
    
}

Cabin.prototype.drawWall = function() {
    stack.push();
    stack.multiply(translate(0,this.wallL/2,0));
    stack.multiply(rotateZ(90));
    stack.multiply(scalem(this.logSize/2, 3, this.logSize/2));

    log.activate();  // activating wood texture
    
    for (var i = 0; i < this.wallN; i++) {
        stack.multiply(translate(this.logSize*2+.5,0,0));
        gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
        gl.uniform1i(uColorMode, 2);
        Shapes.drawPrimitive(Shapes.cylinder);
    }
    
    stack.pop();
};

Cabin.prototype.drawWalls = function() {
    stack.push();
    
    stack.push(); 
    stack.multiply(translate(0,0,this.logSize*this.wallL/2-1));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    this.drawWall(); 
    stack.pop(); 
    
    stack.push(); 
    stack.multiply(translate(0,0,-(this.logSize*this.wallL/2-1)));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    this.drawWall(); 
    stack.pop(); 
    
    stack.multiply(rotateY(90));
    
    stack.push(); 
    stack.multiply(translate(0,0,-(this.logSize*this.wallL/2-1)));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    this.drawWall(); 
    stack.pop(); 
    stack.multiply(translate(0,0,(this.logSize*this.wallL/2-1)));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    this.drawWall(); 
    
    stack.pop();
};

Cabin.prototype.drawSideRoofPanel = function() {
    stack.push(); 
    stack.multiply(scalem(this.logSize*this.wallL-1,this.logSize*this.wallL-2,.2));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1i(uColorMode, 2);
    roof.activate(); 
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop(); 
};

Cabin.prototype.drawRoofPanels = function() {
    stack.push();
    
    stack.push(); 
    stack.multiply(translate(0,this.logSize*this.wallL-1, (this.logSize*this.wallL/2)-1.8));
    stack.multiply(rotateX(45));
    this.drawSideRoofPanel(); 
    stack.pop(); 
    stack.multiply(translate(0,this.logSize*this.wallL-1, -((this.logSize*this.wallL/2)-1.8)));
    stack.multiply(rotateX(-45));
    this.drawSideRoofPanel(); 
    stack.pop(); 
    
};

Cabin.prototype.drawFacade = function() {
    log.activate(); 
        
    stack.push(); 
    
    stack.multiply(translate(0,this.logSize*this.wallL-2.5,0));
    stack.push(); 

    stack.multiply(translate((this.logSize*this.wallL/2)-1,0,0));
    stack.multiply(rotateY(90));
    stack.multiply(scalem(3,3,.2));    
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1i(uColorMode, 2);
    Shapes.drawPrimitive(Shapes.triprism);
    stack.pop(); 
    
    stack.multiply(translate(-((this.logSize*this.wallL/2)-1),0,0));
    stack.multiply(rotateY(90));
    stack.multiply(scalem(3,3,.2));    
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1i(uColorMode, 2);
    Shapes.drawPrimitive(Shapes.triprism);
    
    stack.pop(); 
}

Cabin.prototype.drawFloor = function () {
    stack.push();
    stack.multiply(translate(0,.1,0));
    stack.multiply(scalem(this.logSize*this.wallL-1.2,.2,this.logSize*this.wallL-1));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1i(uColorMode, 2);
    wood.activate(); 
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();
}

Cabin.prototype.drawDoor = function () {
    stack.push();
    stack.multiply(translate(this.logSize*this.wallL/2-.5,this.logSize*this.wallL/2-1.5,0));
    stack.multiply(scalem(.2,3.5,2));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1i(uColorMode, 2);
    door.activate(); 
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();
}

Cabin.prototype.draw = function() {
    this.drawWalls();
    this.drawRoofPanels();
    this.drawFloor();
    this.drawFacade(); 
    this.drawDoor(); 
};