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
   "uniform sampler2D u_Sampler;\n" + 
   "\n" + 
   "varying vec3 vecLight;\n" + 
   "\n" + 
   "varying vec4 vecColor;\n" + 
   "varying vec2 vecTextureCoord;\n" + 
   "\n" + 
   "void main(void) {\n" + 
   "    vec4 vec4MainClr;\n" + 
   "    \n" + 
   "    if ( u_bTexture ) {\n" + 
   "        vec4MainClr = texture2D(u_Sampler, vec2(vecTextureCoord.s, vecTextureCoord.t));\n" + 
   "    } else {\n" + 
   "        vec4MainClr = vecColor;\n" + 
   "    }\n" + 
   "    \n" + 
   "    gl_FragColor = vec4(vec4MainClr.rgb * vecLight, vec4MainClr.a);\n" + 
   "    //gl_FragColor = vec4(vecTextureCoord.s, vecTextureCoord.t, 0.0, 1.0);\n" + 
   "}\n";

g_strShaderCodeVtx = 
   "attribute vec3 a_vec3VertexPosition;\n" + 
   "attribute vec4 a_vec4VertexColor;\n" + 
   "attribute vec3 a_vec3VertexNormal;\n" + 
   "attribute vec2 a_vec2TextureCoord;\n" + 
   "\n" + 
   "uniform mat4 u_matP;\n" + 
   "uniform mat4 u_matMV;\n" + 
   "uniform mat3 u_matN;\n" + 
   "\n" + 
   "uniform vec4 u_vecClrUniform;\n" + 
   "\n" + 
   "uniform vec3 u_vecClrAmb;\n" + 
   "uniform vec3 u_vecClrDir;\n" + 
   "uniform vec3 u_vecDirLight;\n" + 
   "\n" + 
   "uniform bool u_bLight;\n" + 
   "uniform bool u_bColored;\n" + 
   "uniform bool u_bTexture;\n" + 
   "\n" + 
   "varying vec3 vecLight;\n" + 
   "\n" + 
   "varying vec4 vecColor;\n" + 
   "varying vec2 vecTextureCoord;\n" + 
   "\n" + 
   "void main(void) {\n" + 
   "    gl_Position = u_matP * u_matMV * vec4(a_vec3VertexPosition, 1.0);\n" + 
   "    \n" + 
   "    if ( u_bLight ) {\n" + 
   "        vec3 vec3NorTrans = u_matN * a_vec3VertexNormal;\n" + 
   "        float fWeightDir = max(dot(vec3NorTrans, u_vecDirLight), 0.0);\n" + 
   "        vecLight = u_vecClrAmb + u_vecClrDir * fWeightDir;\n" + 
   "    } else {\n" + 
   "        vecLight = vec3(1.0, 1.0, 1.0);\n" + 
   "    }\n" + 
   "    \n" + 
   "    vecColor = ( u_bColored ? a_vec4VertexColor : u_vecClrUniform );\n" + 
   "    vecTextureCoord = a_vec2TextureCoord;\n" + 
   "}\n";

g_strShaderCodeFragPost = 
   "precision mediump float;\n" + 
   "\n" + 
   "uniform sampler2D u_Sampler;\n" + 
   "\n" + 
   "varying vec2 vecTextureCoord;\n" + 
   "\n" + 
   "void main(void) {\n" + 
   "    vec4 vec4MainClr;\n" + 
   "    \n" + 
   "    vec4MainClr = vec4(texture2D(u_Sampler, vecTextureCoord).rgb, 1.0);\n" + 
   "    \n" + 
   "    gl_FragColor = vec4MainClr;\n" + 
   "}\n";

g_strShaderCodeVtxPost = 
   "attribute vec3 a_vec3VertexPosition;\n" + 
   "\n" + 
   "uniform vec2 u_vec2RateResolution;\n" + 
   "\n" + 
   "varying vec2 vecTextureCoord;\n" + 
   "\n" + 
   "void main(void) {\n" + 
   "    gl_Position = vec4(a_vec3VertexPosition, 1.0);\n" + 
   "    \n" + 
   "    vecTextureCoord.s = a_vec3VertexPosition.x / 2.0 * u_vec2RateResolution.s + 0.5;\n" + 
   "    vecTextureCoord.t = a_vec3VertexPosition.y / 2.0 * u_vec2RateResolution.t + 0.5;\n" + 
   "}\n";


////////////////////////////////////////////////////////////////
// 
// glHeader : A header of WebGL
// 
////////////////////////////////////////////////////////////////


function glHeader() {
    this.strShaderCodeVtx  = g_strShaderCodeVtx;
    this.strShaderCodeFrag = g_strShaderCodeFrag;
    
    this.strShaderCodeVtxPost  = g_strShaderCodeVtxPost;
    this.strShaderCodeFragPost = g_strShaderCodeFragPost;
    
    this.addExtraVariables = function(gl, shaderProgram) {
        return 0;
    };
    
    this.bIsUsingFB = false;
    
    this.bOnLight = false;
}


glHeader.prototype.setShaderCodeVtx = function(strCode) {
    this.strShaderCodeVtx = strCode;
}


glHeader.prototype.setShaderCodeFrag = function(strCode) {
    this.strShaderCodeFrag = strCode;
}


glHeader.prototype.setShaderCodeFragPostProc = function(strCode) {
    this.strShaderCodeFragPost = strCode;
}


glHeader.prototype.setFuncExtraVariables = function(funcVar) {
    this.addExtraVariables = funcVar;
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


glHeader.prototype.initShadersScene = function() {
    var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    var vertexShader =   this.gl.createShader(this.gl.VERTEX_SHADER);
    
    this.buildShader(fragmentShader, this.strShaderCodeFrag);
    this.buildShader(vertexShader,   this.strShaderCodeVtx);
    
    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    
    this.gl.linkProgram(this.shaderProgram);
    
    if ( !this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS) ) {
        alert("Could not initialize shaders");
    }
    
    //this.gl.useProgram(this.shaderProgram);
    
    this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 
        "a_vec3VertexPosition");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
    
    this.shaderProgram.vertexNormalAttribute = this.gl.getAttribLocation(this.shaderProgram, 
        "a_vec3VertexNormal");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);
    
    this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, 
        "a_vec4VertexColor");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    
    this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, 
        "a_vec2TextureCoord");
    this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
    
    this.shaderProgram.pMatrixUniform  = this.gl.getUniformLocation(this.shaderProgram, "u_matP");
    this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "u_matMV");
    this.shaderProgram.nMatrixUniform  = this.gl.getUniformLocation(this.shaderProgram, "u_matN");
    
    this.shaderProgram.bLightUniform   = this.gl.getUniformLocation(this.shaderProgram, "u_bLight");
    this.shaderProgram.bColoredUniform = this.gl.getUniformLocation(this.shaderProgram, "u_bColored");
    this.shaderProgram.bTextureUniform = this.gl.getUniformLocation(this.shaderProgram, "u_bTexture");
    
    this.shaderProgram.clrUniform      = this.gl.getUniformLocation(this.shaderProgram, "u_vecClrUniform");
    
    this.shaderProgram.clrAmbUniform   = this.gl.getUniformLocation(this.shaderProgram, "u_vecClrAmb");
    this.shaderProgram.clrDirUniform   = this.gl.getUniformLocation(this.shaderProgram, "u_vecClrDir");
    this.shaderProgram.dirLightUniform = this.gl.getUniformLocation(this.shaderProgram, "u_vecDirLight");
    
    this.shaderProgram.samplerUniform  = this.gl.getUniformLocation(this.shaderProgram, "u_Sampler");
    
    this.addExtraVariables(this.gl, this.shaderProgram);
}


glHeader.prototype.initShadersPostProc = function() {
    var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    var vertexShader =   this.gl.createShader(this.gl.VERTEX_SHADER);
    
    this.buildShader(fragmentShader, this.strShaderCodeFragPost);
    this.buildShader(vertexShader,   this.strShaderCodeVtxPost);
    
    this.postshaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.postshaderProgram, vertexShader);
    this.gl.attachShader(this.postshaderProgram, fragmentShader);
    
    this.gl.linkProgram(this.postshaderProgram);
    
    if ( !this.gl.getProgramParameter(this.postshaderProgram, this.gl.LINK_STATUS) ) {
        alert("Could not initialize shaders");
    }
    
    //this.gl.useProgram(this.postshaderProgram);
    
    this.postshaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.postshaderProgram, 
        "a_vec3VertexPosition");
    this.gl.enableVertexAttribArray(this.postshaderProgram.vertexPositionAttribute);
    
    this.postshaderProgram.vecRateResolution = this.gl.getUniformLocation(this.postshaderProgram, 
        "u_vec2RateResolution");
    this.postshaderProgram.samplerUniform = this.gl.getUniformLocation(this.postshaderProgram, "u_Sampler");
}


glHeader.prototype.initPostProc = function() {
    this.bufVtxPostViewport = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufVtxPostViewport);
    
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
        -1.0,  1.0, 0.0, 
         1.0,  1.0, 0.0, 
        -1.0, -1.0, 0.0, 
         1.0, -1.0, 0.0
    ]), this.gl.STATIC_DRAW);
    this.bufVtxPostViewport.itemSize = 3;
    this.bufVtxPostViewport.numItems = 4;
    
    this.initShadersPostProc();
    
    return 0;
}


glHeader.prototype.initGL = function(canvas) {
    try {
        this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        this.gl.viewportWidth  = canvas.width;
        this.gl.viewportHeight = canvas.height;
    } catch (e) {
        alert("Sorry, there is a problem in initiating WebGL.\n" + 
              "Maybe your browser does not support WebGL. If it does, please contact us.");
    }
    
    this.initShadersScene();
    this.initPostProc();
    
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
}


glHeader.prototype.useSceneProgram = function() {
    this.gl.useProgram(this.shaderProgram);
    
    return 0;
}


glHeader.prototype.usePostProcProgram = function() {
    this.gl.useProgram(this.postshaderProgram);
    
    return 0;
}


glHeader.prototype.disableAllAttribs = function() {
    this.gl.disableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    this.gl.disableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
}


glHeader.prototype.enableColorAttrib = function() {
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
}


glHeader.prototype.isUsingFramebuffer = function() {
    return this.bIsUsingFB;
}


glHeader.prototype.enableTextureAttrib = function() {
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
}


glHeader.prototype.setUsingFramebuffer = function(bUseFramebuffer) {
    this.bIsUsingFB = bUseFramebuffer;
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


glHeader.prototype.getShaderProgram = function() {
    return this.shaderProgram;
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


glHeader.prototype.getSizeFramebuffer = function() {
    var nWidth;
    var nPower;
    
    nWidth = this.gl.viewportWidth - 1;
    nPower = 1;
    
    for ( ; nWidth > 0 ; nWidth = parseInt(nWidth / 2) ) {
        nPower *= 2;
    }
    
    return nPower;
}


glHeader.prototype.getViewportRatio = function() {
    return ( !this.bIsUsingFB ? this.gl.viewportWidth / this.gl.viewportHeight : 1.0 );
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


glHeader.prototype.setViewportWidth = function(nWidth) {
    this.gl.viewportWidth = nWidth;
}


glHeader.prototype.setViewportHeight = function(nHeight) {
    this.gl.viewportHeight = nHeight;
}


glHeader.prototype.initDraw = function(nStatePost) {
    var nPower;
    
    var nViewportWidth, nViewportHeight;
    
    nViewportWidth  = this.gl.viewportWidth;
    nViewportHeight = this.gl.viewportHeight;
    
    if ( !this.bIsUsingFB ) {
        this.useSceneProgram();
    } else {
        nPower = this.getSizeFramebuffer();
        
        if ( !nStatePost ) {
            this.useSceneProgram();
            
            nViewportWidth = nViewportHeight = nPower;
        } else {
            this.usePostProcProgram();
            
            this.gl.uniform2fv(this.postshaderProgram.vecRateResolution, 
                [this.gl.viewportWidth / nPower, this.gl.viewportHeight / nPower]);
        }
    }
    
    this.gl.viewport(0, 0, nViewportWidth, nViewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);
    
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);
}


glHeader.prototype.drawPost = function(frameBufferHead) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufVtxPostViewport);
    this.gl.vertexAttribPointer(this.postshaderProgram.vertexPositionAttribute, 
        this.bufVtxPostViewport.itemSize, this.gl.FLOAT, false, 0, 0);
    
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, frameBufferHead.frameTexture);
    this.gl.uniform1i(this.postshaderProgram.samplerUniform, 0);
    
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.bufVtxPostViewport.numItems);
}


// Most of the following function is from http://learningwebgl.com/lessons/lesson16


glHeader.prototype.createFramebuffer = function() {
    var frameBufferNew;
    var frameTextureNew;
    var renderBuffer;
    
    var nWidth, nHeight;
    
    nWidth = nHeight = this.getSizeFramebuffer();
    
    frameBufferNew = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBufferNew);
    
    frameBufferNew.width  = nWidth;
    frameBufferNew.height = nHeight;
    
    frameTextureNew = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, frameTextureNew);
    
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
    
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, nWidth, nHeight, 
        0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    
    renderBuffer = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderBuffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, nWidth, nHeight);
    
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, 
        this.gl.TEXTURE_2D, frameTextureNew, 0);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, 
        this.gl.RENDERBUFFER, renderBuffer);
    
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    
    return {frameBuffer: frameBufferNew, frameTexture: frameTextureNew};
}


glHeader.prototype.deleteFramebuffer = function(frameBufferHead) {
    this.gl.deleteTexture(frameBufferHead.frameTexture);
    this.gl.deleteFramebuffer(frameBufferHead.frameBuffer);
}


glHeader.prototype.launchFramebuffer = function(frameBufferHead) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBufferHead.frameBuffer);
}


glHeader.prototype.releaseFramebuffer = function(frameBufferHead) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, frameBufferHead.frameTexture);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
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
    this.clrUniform[ 0 ] = arrColor[ 0 ];
    this.clrUniform[ 1 ] = arrColor[ 1 ];
    this.clrUniform[ 2 ] = arrColor[ 2 ];
    this.clrUniform[ 3 ] = arrColor[ 3 ];
    
    this.bIsColored = false;
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


MeshBuffer.prototype.enableTextureMode= function() {
    this.bIsTexture = true;
}


MeshBuffer.prototype.disableTextureMode= function() {
    this.bIsTexture = false;
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
    
    glHeader.setUniformColor(this.clrUniform);
    
    glHeader.setMatrixUniforms(matP, matMV);
    glHeader.setModeColor(this.bIsColored);
    glHeader.setModeTexture(this.bIsTexture);
    
    if ( this.nIsIdxOn != 0 ) {
        gl.drawElements(gl.TRIANGLES, this.vbufIdx.numItems, gl.UNSIGNED_SHORT, 0);
    } else {
        gl.drawArrays(gl.TRIANGLES, 0, this.vbufPos.numItems);
    }
}


MeshBuffer.prototype.freeBuffer = function(glHeader) {
    var gl = glHeader.getGL();
    
    gl.deleteBuffer(this.vbufPos);
    gl.deleteBuffer(this.vbufNor);
    gl.deleteBuffer(this.vbufTex);
    
    delete this.arrVtx;
    delete this.arrNor;
    delete this.arrTex;
    
    if ( this.nIsIdxOn == 1 ) {
        gl.deleteBuffer(this.vbufIdx);
        delete this.arrIdx;
    }
    
    return 0;
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


