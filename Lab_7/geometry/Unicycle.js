//by Elizabeth and Dakota, using Dakota's primitives
function Unicycle(){    
    this.name = "Unicycle";
    this.wheelRad = 5; //wheel radius
    this.wheelThick = 0.5; //wheel thickness
    this.seatWidth = 3; //seat width
    this.rodDepth = 1;
    this.topColor = vec4(1.0, 0.0, 0.0, 1.0); //red
    this.wheelColor = vec4(0.0, 1.0, 0.0, 1.0); //green
    this.pedalColor = vec4(0.0, 0.0, 1.0, 1.0); //blue
//    this.thetaX = 0;
}

Unicycle.prototype.drawSeat = function(){
    stack.push();
    stack.multiply(translate(0,15.5,0));
    stack.multiply(scalem(this.seatWidth,1,2)); 
    Shapes.drawPrimitive(Shapes.cube, { transform: stack.top (), color: this.topColor }); 
    stack.pop();
}
Unicycle.prototype.drawRods = function(){
     //Rod from seat
    stack.push();
    stack.multiply(translate(0,13.5,0));
    stack.multiply(scalem(1,3,1));
    Shapes.drawPrimitive(Shapes.cube, { transform: stack.top (), color: this.topColor }); 
    stack.pop();
    
    //middle rod
    stack.push();
    stack.multiply(translate(0,11.5,0));
    stack.multiply(scalem(3,1,1)); 
    Shapes.drawPrimitive(Shapes.cube, { transform: stack.top (), color: this.topColor }); 
    stack.pop();
    
    
    //side connecting rods
    stack.push();
    stack.multiply(translate(0,8.25,0));
    stack.push();
    stack.multiply(translate(2,0,0));
    stack.multiply(scalem(1,7.5,1)); 
    Shapes.drawPrimitive(Shapes.cube, { transform: stack.top (), color: this.topColor });
    stack.pop();
    stack.multiply(translate(-2,0,0));
    stack.multiply(scalem(1,7.5,1)); 
    Shapes.drawPrimitive(Shapes.cube, { transform: stack.top (), color: this.topColor });
    stack.pop();
}
Unicycle.prototype.connect = function(){
    //Beginning of rotation section
    stack.push();
    stack.multiply(translate(0,5,0));
    stack.multiply(rotateX(thetaX));
}
Unicycle.prototype.drawWheel = function(){
     //Wheel
    stack.push();
    stack.multiply(rotateZ(90));
    stack.multiply(scalem(this.wheelRad,this.wheelThick,this.wheelRad)); 
    // console.log("Plz work!");
    Shapes.drawPrimitive(Shapes.cylinder, { transform: stack.top (), color: this.wheelColor });
    stack.pop();
}
Unicycle.prototype.drawAxel = function(){
     //Axle
    stack.push();
    stack.multiply(rotateZ(90));
    stack.multiply(scalem(0.5,2,0.5)); 
    Shapes.drawPrimitive(Shapes.cylinder, { transform: stack.top (), color: this.wheelColor });
    stack.pop();
}
Unicycle.prototype.addPedalSpokes = function(){
    //right pedal spoke
    stack.push();
    stack.multiply(translate(3,1,0));
    stack.multiply(scalem(1,3,1)); 
    Shapes.drawPrimitive(Shapes.cube, { transform: stack.top (), color: this.pedalColor });
    stack.pop();

     //left pedal spoke
    stack.push();
    stack.multiply(translate(-3,-1,0));
    stack.multiply(scalem(1,3,1)); 
    Shapes.drawPrimitive(Shapes.cube, { transform: stack.top (), color: this.pedalColor });
    stack.pop();
}
Unicycle.prototype.addPedals = function(){
     //right pedal
    stack.push();
    stack.multiply(translate(4,2,0));
    stack.multiply(scalem(1.5,0.75,0.75));
    stack.multiply(rotateZ(90)); 
    Shapes.drawPrimitive(Shapes.cylinder, { transform: stack.top (), color: this.pedalColor });
    stack.pop();
    
    //left pedal
//    stack.push();
    stack.multiply(translate(-4,-2,0));
    stack.multiply(scalem(1.5,0.75,0.75));
    stack.multiply(rotateZ(90)); 
    Shapes.drawPrimitive(Shapes.cylinder, { transform: stack.top (), color: this.pedalColor });
    stack.pop();
}
Unicycle.prototype.drawUnicycle = function(){ //put it all together
    stack.push();
    this.drawSeat();
//    console.log("HERe!!");
    this.drawRods(); 
    this.connect();
    this.drawWheel();
    this.drawAxel();
    this.addPedalSpokes();
    this.addPedals();
    stack.pop();
}