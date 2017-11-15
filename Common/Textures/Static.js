/* Create a checkerboard pattern
 */

function Static()
{
    this.width = 64;    // width (# of pixels) of the texture
    this.height = 64;   // height (# of pixels) of the texture
    this.numRows = 8;   // number of checkerboard squares in a row
    this.numCols = 8;   // number of checkerboard squares in a column
    this.makeStatic();
    this.init();
}

/**
 * Create an array of uInts. Load the array with the texture pattern. 
 * Note, the 2D texture is stored in a 1D array.
 * @return {undefined}
 */
Static.prototype.makeStatic = function () {
    this.texels = new Uint8Array(4 * this.width * this.height);

    for (var i = 0; i < this.width; i++)
    {
        for (var j = 0; j < this.height; j++)
        {
            var patchx = Math.floor(i / (this.width / this.numRows));
            var patchy = Math.floor(j / (this.height / this.numCols));


            var k = 4 * (i * this.width + j);
            
            
            //use this code if you want stripes 
            if ((i/4)%2 === 0){
                this.texels[k] = 173; //changes levels of red
                this.texels[k + 1] = 43; //changes levels of green
                this.texels[k + 2] = 129; //changes blue values
            }
            else {
                this.texels[k] = 33; //changes levels of red
                this.texels[k + 1] = 33; //changes levels of green
                this.texels[k + 2] = 33; //changes blue values
            }
            
            
            
            //use this code if you want the tv static
            //var fuzz = Math.random()*255;

            //this.texels[k] = fuzz; //changes levels of red
            //this.texels[k + 1] = fuzz; //changes levels of green
            //this.texels[k + 2] = fuzz; //changes blue values
            //his.texels[k + 3] = 255; // this seems literally useless
        }
    }
};

/**
 *  Call this to create the texture buffer and set texture parameters.
 * @return {undefined}
 */
Static.prototype.init = function () {
    // Generate texture ID and bind to this ID
    this.texID = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texID);

    // loads the texture onto the GPU
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, this.texels);

    // Set parameters
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
};

/**
 * Call this when you are ready to use the texture
 * @return {undefined}
 */
Static.prototype.activate = function () {
    // GL provides 32 texture registers; the first of these is gl.TEXTURE0.
    gl.activeTexture(gl.TEXTURE0); // activate texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, this.texID);
    gl.uniform1i(uTexture, 0);     // associate uTexture in shader with texture unit 0
};
