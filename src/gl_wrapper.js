////////////////////////////////////////////////////////////////
// 
// The following codes are very powered by 
// http://learningwebgl.com
// 
////////////////////////////////////////////////////////////////


g_strShaderCodeFrag = 
    "precision mediump float;\n" + 
    "\n" + 
    "uniform bool u_bTexture;\n" + 
    "uniform sampler2D uSampler;\n" + 
    "\n" + 
    "varying vec3 vLight;\n" + 
    "\n" + 
    "varying vec4 vColor;\n" + 
    "varying vec2 vTextureCoord;\n" + 
    "\n" + 
    "void main(void) {\n" + 
    "    vec4 vec4MainClr;\n" + 
    "    \n" + 
    "    if ( u_bTexture ) {\n" + 
    "        vec4MainClr = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n" + 
    "    } else {\n" + 
    "        vec4MainClr = vColor;\n" + 
    "    }\n" + 
    "    \n" + 
    "    gl_FragColor = vec4(vec4MainClr.rgb * vLight, vec4MainClr.a);\n" + 
    "}\n";

g_strShaderCodeVtx = 
    "attribute vec3 aVertexPosition;\n" + 
    "attribute vec4 aVertexColor;\n" + 
    "attribute vec3 aVertexNormal;\n" + 
    "attribute vec2 aTextureCoord;\n" + 
    "\n" + 
    "uniform mat4 uMVMatrix;\n" + 
    "uniform mat4 uPMatrix;\n" + 
    "uniform mat3 uNMatrix;\n" + 
    "\n" + 
    "uniform vec4 uClrUniform;\n" + 
    "\n" + 
    "uniform vec3 uClrAmb;\n" + 
    "uniform vec3 uClrDir;\n" + 
    "uniform vec3 uDirLight;\n" + 
    "\n" + 
    "uniform bool u_bLight;\n" + 
    "uniform bool u_bColored;\n" + 
    "uniform bool u_bTexture;\n" + 
    "\n" + 
    "varying vec3 vLight;\n" + 
    "\n" + 
    "varying vec4 vColor;\n" + 
    "varying vec2 vTextureCoord;\n" + 
    "\n" + 
    "void main(void) {\n" + 
    "    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n" + 
    "    \n" + 
    "    if ( u_bLight ) {\n" + 
    "        vec3 vec3NorTrans = uNMatrix * aVertexNormal;\n" + 
    "        float fWeightDir = max(dot(vec3NorTrans, uDirLight), 0.0);\n" + 
    "        vLight = uClrAmb + uClrDir * fWeightDir;\n" + 
    "    } else {\n" + 
    "        vLight = vec3(1.0, 1.0, 1.0);\n" + 
    "    }\n" + 
    "    \n" + 
    "    //vColor = ( u_bColored ? aVertexColor : uClrUniform );\n" + 
    "    vColor = aVertexColor;\n" + 
    "    vTextureCoord = aTextureCoord;\n" + 
    "}\n";


////////////////////////////////////////////////////////////////
// 
// glHeader : A header of WebGL
// 
////////////////////////////////////////////////////////////////


function glHeader() {
    this.bOnLight = false;
}


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
    
    this.shaderProgram.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, 
        "aVertexNormal");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
    
    this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, 
        "aVertexColor");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    
    this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, 
        "aTextureCoord");
    this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
    
    this.shaderProgram.pMatrixUniform  = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.shaderProgram.nMatrixUniform  = this.gl.getUniformLocation(this.shaderProgram, "uNMatrix");
    
    this.shaderProgram.bLightUniform   = this.gl.getUniformLocation(this.shaderProgram, "u_bLight");
    this.shaderProgram.bColoredUniform = this.gl.getUniformLocation(this.shaderProgram, "u_bColored");
    this.shaderProgram.bTextureUniform = this.gl.getUniformLocation(this.shaderProgram, "u_bTexture");
    
    this.shaderProgram.clrUniform   = this.gl.getUniformLocation(this.shaderProgram, "uClrUniform");
    
    this.shaderProgram.clrAmbUniform   = this.gl.getUniformLocation(this.shaderProgram, "uClrAmb");
    this.shaderProgram.clrDirUniform   = this.gl.getUniformLocation(this.shaderProgram, "uClrDir");
    this.shaderProgram.dirLightUniform = this.gl.getUniformLocation(this.shaderProgram, "uDirLight");
    
    this.shaderProgram.samplerUniform  = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
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
    
    var matNor = mat3.create();
    mat4.toInverseMat3(matMV, matNor);
    mat3.transpose(matNor);
    this.gl.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, matNor);
}


glHeader.prototype.setModeColor = function(bColored) {
    this.gl.uniform1i(this.shaderProgram.bColoredUniform, bColored);
}


glHeader.prototype.setModeTexture = function(bTexture) {
    this.gl.uniform1i(this.shaderProgram.bTextureUniform, bTexture);
}


glHeader.prototype.setUniformColor = function(arrClrUniform) {
    this.gl.uniform4fv(this.shaderProgram.clrUniform, arrClrUniform);
}


glHeader.prototype.isOnLight = function() {
    return this.bLight;
}


glHeader.prototype.enableLight = function() {
    this.bLight = true;
    this.gl.uniform1i(this.shaderProgram.bLightUniform, this.bLight);
}


glHeader.prototype.disableLight = function() {
    this.bLight = false;
    this.gl.uniform1i(this.shaderProgram.bLightUniform, this.bLight);
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


glHeader.prototype.getVtxNorAttrib = function() {
    return this.shaderProgram.vertexNormalAttribute;
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


glHeader.prototype.setLightAmbient = function(arrClrAmb) {
    this.gl.uniform3fv(this.shaderProgram.clrAmbUniform, arrClrAmb);
}


glHeader.prototype.setLightDirectional = function(arrClrDir, arrDirLight) {
    var vecDirMod = vec3.create();
    vec3.normalize(arrDirLight, vecDirMod);
    vec3.scale(vecDirMod, -1);
    
    this.gl.uniform3fv(this.shaderProgram.dirLightUniform, vecDirMod);
    this.gl.uniform3fv(this.shaderProgram.clrDirUniform, arrClrDir);
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


function MeshBuffer(glHeader) {
    this.nIsIdxOn = 0;
    this.bIsColored = false;
    this.bIsTexture = false;
    
    this.clrUniform = [1.0, 1.0, 1.0, 1.0];
}


MeshBuffer.prototype.insertVertexArray = function(glHeader, arrVtx, nNumVtx) {
    var gl = glHeader.getGL();
    
    this.vbufPos = gl.createBuffer();
    this.arrVtx = new Float32Array(arrVtx);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.arrVtx, gl.STATIC_DRAW);
    
    this.vbufPos.itemSize = 3;
    this.vbufPos.numItems = nNumVtx;
    
    this.vbufNor = gl.createBuffer();
    this.vbufClr = gl.createBuffer();
    this.vbufTex = gl.createBuffer();
    
    // For setting dummy data of normal vectors
    this.arrNor = new Float32Array(3 * nNumVtx);
    
    for ( var i = 0 ; i < 3 * nNumVtx ; i++ ) {
        this.arrNor[ i ] = 0.0;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.arrNor, gl.STATIC_DRAW);
    
    this.vbufNor.itemSize = 3;
    this.vbufNor.numItems = nNumVtx;
    
    // For setting dummy data of colors
    this.arrClr = new Float32Array(4 * nNumVtx);
    
    for ( var i = 0 ; i < 4 * nNumVtx ; i++ ) {
        this.arrClr[ i ] = 1.0;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufClr);
    gl.bufferData(gl.ARRAY_BUFFER, this.arrClr, gl.STATIC_DRAW);
    
    this.vbufClr.itemSize = 4;
    this.vbufClr.numItems = nNumVtx;
    
    // For setting dummy data of texture mappings
    this.arrTex = new Float32Array(2 * nNumVtx);
    
    for ( var i = 0 ; i < 2 * nNumVtx ; i++ ) {
        this.arrTex[ i ] = 0.0;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufTex);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrTexDump), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, this.arrTex, gl.STATIC_DRAW);
    
    this.vbufTex.itemSize = 2;
    this.vbufTex.numItems = nNumVtx;
}


MeshBuffer.prototype.modifyVertexArray = function(glHeader, arrVtx) {
    var gl = glHeader.getGL();
    
    for ( var i = 0 ; i < 3 * this.vbufPos.numItems ; i++ ) {
        this.arrVtx[ i ] = arrVtx[ i ];
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.arrVtx, gl.STATIC_DRAW);
}


MeshBuffer.prototype.insertIndexArray = function(glHeader, arrIdx, nNumIdx) {
    var gl = glHeader.getGL();
    
    if ( this.nIsIdxOn != 0 ) {
        gl.deleteBuffer(this.vbufIdx);
        delete this.arrIdx;
    }
    
    this.vbufIdx = gl.createBuffer();
    this.arrIdx = new Uint16Array(arrIdx);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.arrIdx, gl.STATIC_DRAW);
    
    this.vbufIdx.itemSize = 1;
    this.vbufIdx.numItems = nNumIdx;
    
    this.nIsIdxOn = 1;
}


MeshBuffer.prototype.insertNormalArray = function(glHeader, arrNormal, nNumNormal) {
    var gl = glHeader.getGL();
    
    for ( var i = 0 ; i < 3 * this.vbufNor.numItems ; i++ ) {
        this.arrNor[ i ] = arrNormal[ i ];
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.arrNor, gl.STATIC_DRAW);
}


MeshBuffer.prototype.insertColorArray = function(glHeader, arrColor, nNumColor) {
    var gl = glHeader.getGL();
    
    for ( var i = 0 ; i < 4 * this.vbufClr.numItems ; i++ ) {
        this.arrClr[ i ] = arrColor[ i ];
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufClr);
    gl.bufferData(gl.ARRAY_BUFFER, this.arrClr, gl.STATIC_DRAW);
    
    this.bIsColored = true;
}


MeshBuffer.prototype.setUniformColor = function(glHeader, arrColor) {
    var gl = glHeader.getGL();
    
    for ( var i = 0 ; i < this.vbufClr.numItems ; i++ ) {
        this.arrClr[ 4 * i + 0 ] = arrColor[ 0 ];
        this.arrClr[ 4 * i + 1 ] = arrColor[ 1 ];
        this.arrClr[ 4 * i + 2 ] = arrColor[ 2 ];
        this.arrClr[ 4 * i + 3 ] = arrColor[ 3 ];
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufClr);
    gl.bufferData(gl.ARRAY_BUFFER, this.arrClr, gl.STATIC_DRAW);
    
    this.bIsColored = true;
}


MeshBuffer.prototype.insertTextureArray = function(glHeader, arrTexture, nNumTexture) {
    var gl = glHeader.getGL();
    
    for ( var i = 0 ; i < 2 * this.vbufTex.numItems ; i++ ) {
        this.arrTex[ i ] = arrTexture[ i ];
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufTex);
    gl.bufferData(gl.ARRAY_BUFFER, this.arrTex, gl.STATIC_DRAW);
    
    this.bIsTexture = true;
}


MeshBuffer.prototype.drawMesh = function(glHeader, matP, matMV) {
    var gl = glHeader.getGL();
    
    //glHeader.disableAllAttribs();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufPos);
    gl.vertexAttribPointer(glHeader.getVtxPosAttrib(), this.vbufPos.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufNor);
    gl.vertexAttribPointer(glHeader.getVtxNorAttrib(), this.vbufNor.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufClr);
    gl.vertexAttribPointer(glHeader.getVtxClrAttrib(), this.vbufClr.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufTex);
    gl.vertexAttribPointer(glHeader.getVtxTexAttrib(), this.vbufTex.itemSize, gl.FLOAT, false, 0, 0);
    
    if ( this.nIsIdxOn != 0 ) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbufIdx);
    }
    
    glHeader.setMatrixUniforms(matP, matMV);
    //glHeader.setModeColor(this.bIsColored);
    glHeader.setModeTexture(this.bIsTexture);
    
    if ( this.nIsIdxOn != 0 ) {
        gl.drawElements(gl.TRIANGLES, this.vbufIdx.numItems, gl.UNSIGNED_SHORT, 0);
    } else {
        gl.drawArrays(gl.TRIANGLES, 0, this.vbufPos.numItems);
    }
}


////////////////////////////////////////////////////////////////
// 
// TextureBuffer : Containing informations about texture
// 
////////////////////////////////////////////////////////////////


function TextureBuffer(glHeader, strFilename) {
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


TextureBuffer.prototype.bindTexture = function(glHeader, nID) {
    var gl = glHeader.getGL();
    
    switch ( nID ) {
        case 0: gl.activeTexture(gl.TEXTURE0); break;
        case 1: gl.activeTexture(gl.TEXTURE1); break;
        case 2: gl.activeTexture(gl.TEXTURE2); break;
        case 3: gl.activeTexture(gl.TEXTURE3); break;
        default: alert("Invalid texture ID"); return -1;
    }
    
    gl.bindTexture(gl.TEXTURE_2D, this.texMain);
    glHeader.setSampler(nID);
}


