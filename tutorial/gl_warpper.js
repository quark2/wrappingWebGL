////////////////////////////////////////////////////////////////
// 
// The following codes are very powered by 
// http://learningwebgl.com
// 
////////////////////////////////////////////////////////////////


g_strShaderCodeFrag = 
    "precision mediump float;\n" + 
    "\n" + 
    "varying vec4 vColor;\n" + 
    "\n" + 
    "varying vec2 vTextureCoord;\n" + 
    "uniform sampler2D uSampler;\n" + 
    "\n" + 
    "uniform bool u_bTexture;\n" + 
    "\n" + 
    "void main(void) {\n" + 
    "    if ( u_bTexture ) {\n" + 
    "        gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n" + 
    "    } else {\n" + 
    "        gl_FragColor = vColor;\n" + 
    "    }\n" + 
    "}\n";

g_strShaderCodeVtx = 
   "attribute vec3 aVertexPosition;\n" + 
   "attribute vec4 aVertexColor;\n" + 
   "attribute vec2 aTextureCoord;\n" + 
   "\n" + 
   "uniform mat4 uMVMatrix;\n" + 
   "uniform mat4 uPMatrix;\n" + 
   "\n" + 
   "varying vec4 vColor;\n" + 
   "varying vec2 vTextureCoord;\n" + 
   "\n" + 
   "uniform bool u_bTexture;\n" + 
   "\n" + 
   "void main(void) {\n" + 
   "    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n" + 
   "    vTextureCoord = aTextureCoord;\n" + 
   "    vColor = aVertexColor;\n" + 
   "}\n";


////////////////////////////////////////////////////////////////
// 
// glHeader : A header of WebGL
// 
////////////////////////////////////////////////////////////////


function glHeader() {}


glHeader.prototype.buildShader = function(shader, strCode) {
    this.gl.shaderSource(shader, strCode);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        alert(this.gl.getShaderInfoLog(shader));
        return -1;
    }
    
    return 0;
}


glHeader.prototype.initShaders = function() {
    var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    var vertexShader =   this.gl.createShader(this.gl.VERTEX_SHADER);
    
    this.buildShader(fragmentShader, g_strShaderCodeFrag);
    this.buildShader(vertexShader,   g_strShaderCodeVtx);
    
    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    
    this.gl.linkProgram(this.shaderProgram);
    
    if ( !this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS) ) {
        alert("Could not initialize shaders");
    }
    
    this.gl.useProgram(this.shaderProgram);
    
    this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 
        "aVertexPosition");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    
    this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, 
        "aVertexColor");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    
    this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, 
        "aTextureCoord");
    this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
    
    this.shaderProgram.pMatrixUniform  = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
    this.shaderProgram.bTextureUniform = this.gl.getUniformLocation(this.shaderProgram, "u_bTexture");
}


glHeader.prototype.initGL = function(canvas) {
    try {
        this.gl = canvas.getContext("experimental-webgl");
        this.gl.viewportWidth  = canvas.width;
        this.gl.viewportHeight = canvas.height;
    } catch (e) {
        alert("Sorry, there is a problem in initiating WebGL.\n" + 
              "Maybe your browser does not support WebGL. If it does, please contact us.");
    }
    
    this.initShaders();
    
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
}


glHeader.prototype.disableAllAttribs = function() {
    this.gl.disableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    this.gl.disableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
}


glHeader.prototype.enableColorAttrib = function() {
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
}


glHeader.prototype.enableTextureAttrib = function() {
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
}


glHeader.prototype.setMatrixUniforms = function(matP, matMV) {
    this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform,  false, matP);
    this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, matMV);
}


glHeader.prototype.setModeColorTexture = function(bTexture) {
    this.gl.uniform1i(this.shaderProgram.bTextureUniform, bTexture);
}


glHeader.prototype.setSampler = function(nID) {
    this.gl.uniform1i(this.shaderProgram.samplerUniform, nID);
}


glHeader.prototype.getGL = function() {
    return this.gl;
}


glHeader.prototype.getVtxPosAttrib = function() {
    return this.shaderProgram.vertexPositionAttribute;
}


glHeader.prototype.getVtxClrAttrib = function() {
    return this.shaderProgram.vertexColorAttribute;
}


glHeader.prototype.getVtxTexAttrib = function() {
    return this.shaderProgram.textureCoordAttribute;
}


glHeader.prototype.getViewportWidth = function() {
    return this.gl.viewportWidth;
}


glHeader.prototype.getViewportHeight = function() {
    return this.gl.viewportHeight;
}


glHeader.prototype.initDraw = function() {
    glCurr = this.gl;
    
    glCurr.viewport(0, 0, glCurr.viewportWidth, glCurr.viewportHeight);
    glCurr.clear(glCurr.COLOR_BUFFER_BIT | glCurr.DEPTH_BUFFER_BIT);
}


////////////////////////////////////////////////////////////////
// 
// MeshBuffer : Containing informations about a mesh and 
//              Drawing the mesh
// 
////////////////////////////////////////////////////////////////


function MeshBufer(glHeader) {
    this.nIsIdxOn = 0;
    this.bIsTexture = false;
}


MeshBufer.prototype.insertVertexArray = function(glHeader, arrVtx, nNumVtx) {
    var gl = glHeader.getGL();
    
    this.vbufPos = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVtx), gl.STATIC_DRAW);
    
    this.vbufPos.itemSize = 3;
    this.vbufPos.numItems = nNumVtx;
    
    this.vbufClr = gl.createBuffer();
    this.vbufTex = gl.createBuffer();
    
    // For setting dummy data of colors
    var arrClrDump = new Float32Array(4 * nNumVtx);
    
    for ( var i = 0 ; i < 4 * nNumVtx ; i++ ) {
        arrClrDump[ i ] = 1.0;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufClr);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrClrDump), gl.STATIC_DRAW);
    
    this.vbufClr.itemSize = 4;
    this.vbufClr.numItems = nNumVtx;
    
    // For setting dummy data of texture mappings
    var arrTexDump = new Float32Array(2 * nNumVtx);
    
    for ( var i = 0 ; i < 2 * nNumVtx ; i++ ) {
        arrTexDump[ i ] = 0.0;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufTex);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrTexDump), gl.STATIC_DRAW);
    
    this.vbufTex.itemSize = 2;
    this.vbufTex.numItems = nNumVtx;
}


MeshBufer.prototype.insertIndexArray = function(glHeader, arrIdx, nNumIdx) {
    var gl = glHeader.getGL();
    
    this.vbufIdx = gl.createBuffer();
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrIdx), gl.STATIC_DRAW);
    
    this.vbufIdx.itemSize = 1;
    this.vbufIdx.numItems = nNumIdx;
    
    this.nIsIdxOn = 1;
}


MeshBufer.prototype.insertColorArray = function(glHeader, arrColor, nNumColor) {
    var gl = glHeader.getGL();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufClr);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrColor), gl.STATIC_DRAW);
}


MeshBufer.prototype.insertTextureArray = function(glHeader, arrTexture, nNumTexture) {
    var gl = glHeader.getGL();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufTex);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrTexture), gl.STATIC_DRAW);
    
    this.bIsTexture = true;
}


MeshBufer.prototype.drawMesh = function(glHeader, matP, matMV) {
    var gl = glHeader.getGL();
    
    //glHeader.disableAllAttribs();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufPos);
    gl.vertexAttribPointer(glHeader.getVtxPosAttrib(), this.vbufPos.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufClr);
    gl.vertexAttribPointer(glHeader.getVtxClrAttrib(), this.vbufClr.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufTex);
    gl.vertexAttribPointer(glHeader.getVtxTexAttrib(), this.vbufTex.itemSize, gl.FLOAT, false, 0, 0);
    
    if ( this.nIsIdxOn != 0 ) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbufIdx);
    }
    
    glHeader.setMatrixUniforms(matP, matMV);
    glHeader.setModeColorTexture(this.bIsTexture);
    
    if ( this.nIsIdxOn != 0 ) {
        gl.drawElements(gl.TRIANGLES, this.vbufIdx.numItems, gl.UNSIGNED_SHORT, 0);
    } else {
        gl.drawArrays(gl.TRIANGLES, 0, this.vbufPos.numItems);
    }
}


////////////////////////////////////////////////////////////////
// 
// MeshBuffer : Containing informations about a mesh and 
//              Drawing the mesh
// 
////////////////////////////////////////////////////////////////


function TextureBufer(glHeader, strFilename) {
    var gl = glHeader.getGL();
    
    var texCurr= gl.createTexture();
    texCurr.image = new Image();
    
    texCurr.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texCurr);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCurr.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    
    texCurr.image.src = strFilename;
    
    this.texMain = texCurr;
}


TextureBufer.prototype.bindTexture = function(glHeader, nID) {
    var gl = glHeader.getGL();
    
    switch ( nID ) {
        case 0: gl.activeTexture(gl.TEXTURE0);break;
        case 1: gl.activeTexture(gl.TEXTURE1);break;
        case 2: gl.activeTexture(gl.TEXTURE2);break;
        case 3: gl.activeTexture(gl.TEXTURE3);break;
        default: alert("Invalid texture ID"); return -1;
    }
    
    gl.bindTexture(gl.TEXTURE_2D, this.texMain);
    glHeader.setSampler(nID);
}


