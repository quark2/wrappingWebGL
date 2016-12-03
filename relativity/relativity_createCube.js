function myPolygonData() {
    this.pgfVtx = null;
    this.pgfVtxOrg = null;
    
    this.pgfNor = null;
    this.pgfNorOrg = null;
    
    this.pgunIdxFace = null;
    
    this.nNumVtx = 0;
    this.nNumFace = 0;
    
    this.arrgfColor = [1.0, 1.0, 1.0, 1.0];
    
    this.bufMesh = null;
    
    this.vecPos = [0.0, 0.0, 0.0];
    this.gfSize = 1.0;
    
    this.matMV = mat4.create();
    this.matN  = mat3.create();
    
    mat4.identity(this.matMV);
    mat3.identity(this.matN);
}


myPolygonData.prototype.renewVertexInfo = function(glHeader) {
    this.bufMesh.modifyVertexArray(glHeader, this.pgfVtx);
    this.bufMesh.insertNormalArray(glHeader, this.pgfNor);
}


myPolygonData.prototype.getNumVtx = function() {
    return this.nNumVtx;
}


myPolygonData.prototype.getNumFace = function() {
    return this.nNumFace;
}


myPolygonData.prototype.getColor = function(arrColor) {
    arrColor[ 0 ] = this.arrgfColor[ 0 ];
    arrColor[ 1 ] = this.arrgfColor[ 1 ];
    arrColor[ 2 ] = this.arrgfColor[ 2 ];
    arrColor[ 3 ] = this.arrgfColor[ 3 ];
    
    return arrColor;
}


myPolygonData.prototype.getBufVtx = function() {
    return this.pgfVtx;
}


myPolygonData.prototype.getBufVtxOrg = function() {
    return this.pgfVtxOrg;
}


myPolygonData.prototype.getBufNor = function() {
    return this.pgfNor;
}


myPolygonData.prototype.getBufNorOrg = function() {
    return this.pgfNorOrg;
}


myPolygonData.prototype.getBufIdx = function() {
    return this.pgunIdxFace;
}


myPolygonData.prototype.getBufMesh = function() {
    return this.bufMesh;
}


myPolygonData.prototype.getPos = function(vecPos) {
    vecPos[ 0 ] = this.vecPos[ 0 ];
    vecPos[ 1 ] = this.vecPos[ 1 ];
    vecPos[ 2 ] = this.vecPos[ 2 ];
    
    return vecPos;
}


myPolygonData.prototype.getSize = function() {
    return this.gfSize;
}


myPolygonData.prototype.getMatrixWorld = function() {
    return this.matMV;
}


myPolygonData.prototype.getMatrixNormalWorld = function() {
    return this.matN;
}


myPolygonData.prototype.setNumVtx = function(nNumVtx) {
    this.nNumVtx = nNumVtx;
}


myPolygonData.prototype.setNumFace = function(nNumFace) {
    this.nNumFace = nNumFace;
}


myPolygonData.prototype.setColor = function(arrColor) {
    this.arrgfColor[ 0 ] = arrColor[ 0 ];
    this.arrgfColor[ 1 ] = arrColor[ 1 ];
    this.arrgfColor[ 2 ] = arrColor[ 2 ];
    this.arrgfColor[ 3 ] = arrColor[ 3 ];
}


myPolygonData.prototype.setBufVtx = function(arrVtx) {
    this.pgfVtx = arrVtx;
}


myPolygonData.prototype.setBufVtxOrg = function(arrVtx) {
    this.pgfVtxOrg = arrVtx;
}


myPolygonData.prototype.setBufNor = function(arrNor) {
    this.pgfNor = arrNor;
}


myPolygonData.prototype.setBufNorOrg = function(arrNor) {
    this.pgfNorOrg = arrNor;
}


myPolygonData.prototype.setBufIdx = function(arrIdx) {
    this.pgunIdxFace = arrIdx;
}


myPolygonData.prototype.setBufMesh = function(bufMesh) {
    this.bufMesh = bufMesh;
}


myPolygonData.prototype.setPos = function(vecPos) {
    this.vecPos[ 0 ] = vecPos[ 0 ];
    this.vecPos[ 1 ] = vecPos[ 1 ];
    this.vecPos[ 2 ] = vecPos[ 2 ];
}


myPolygonData.prototype.setSize = function(gfSize) {
    this.gfSize = gfSize;
}


myPolygonData.prototype.setMatrixWorld = function(matMV) {
    mat4.set(matMV, this.matMV);
    
    mat4.toInverseMat3(matMV, this.matN);
    mat3.transpose(this.matN);
}


function myAddVFCuboidFace(pPoly, arrnIdx, nDivA, nDivB, gfXInit, gfYInit, gfZInit, 
                           gfAddAX, gfAddAY, gfAddAZ, gfAddBX, gfAddBY, gfAddBZ)
{
	var i, j;
    
    var arrVtxOrg, arrNorOrg, arrIdx;
	
	var gfXCurr, gfYCurr, gfZCurr;
	var gfNX, gfNY, gfNZ, gfNormN;
    
	var nIdxBufV, nIdxBufN, nIdxBufF;
    var nIdxV, nIdxF;
    
    arrVtxOrg = pPoly.getBufVtxOrg();
    arrNorOrg = pPoly.getBufNorOrg();
    arrIdx = pPoly.getBufIdx();
    
    nIdxV = arrnIdx[ 0 ];
    nIdxF = arrnIdx[ 1 ];
	
	gfXCurr = gfXInit;
	gfYCurr = gfYInit;
	gfZCurr = gfZInit;
	
	// Obtaining the normal vector
	gfNX =  gfAddAY * gfAddBZ - gfAddAZ * gfAddBY;
	gfNY = -gfAddAX * gfAddBZ + gfAddAZ * gfAddBX;
	gfNZ =  gfAddAX * gfAddBY - gfAddAY * gfAddBX;
	
	gfNormN = Math.sqrt(gfNX * gfNX + gfNY * gfNY + gfNZ * gfNZ);
	
	gfNX /= gfNormN;
	gfNY /= gfNormN;
	gfNZ /= gfNormN;
	
	// Putting the vertices on the current face
	for ( i = 0 ; i < nDivB + 1 ; i++ ) {
		if ( gfAddAX != 0.0 ) {
			gfXCurr = gfXInit;
		}
		
		if ( gfAddAY != 0.0 ) {
			gfYCurr = gfYInit;
		}
		
		if ( gfAddAZ != 0.0 ) {
			gfZCurr = gfZInit;
		}
		
		for ( j = 0 ; j < nDivA + 1 ; j++ ) {
			nIdxBufV = 3 * ( nIdxV + ( ( nDivA + 1 ) * i + j ) );
			nIdxBufN = 3 * ( nIdxV + ( ( nDivA + 1 ) * i + j ) );
			
			// structure of pgfVtx : 
			// (( nx, ny, nz, vx, vy, vz ), ...) (6 ents)
			
			arrVtxOrg[ nIdxBufV + 0 ] = gfXCurr;
			arrVtxOrg[ nIdxBufV + 1 ] = gfYCurr;
			arrVtxOrg[ nIdxBufV + 2 ] = gfZCurr;
			
			arrNorOrg[ nIdxBufN + 0 ] = gfNX;
			arrNorOrg[ nIdxBufN + 1 ] = gfNY;
			arrNorOrg[ nIdxBufN + 2 ] = gfNZ;
			
			gfXCurr += gfAddAX;
			gfYCurr += gfAddAY;
			gfZCurr += gfAddAZ;
		}
		
		gfXCurr += gfAddBX;
		gfYCurr += gfAddBY;
		gfZCurr += gfAddBZ;
	}
	
	// Putting the edges and faces of triangles on the current face
	for ( i = 0 ; i < nDivB ; i++ ) {
		for ( j = 0 ; j < nDivA ; j++ ) {
			nIdxBufV = nIdxV + ( nDivA + 1 ) * i + j;
			nIdxBufF = 3 * ( nIdxF + 2 * ( nDivA * i + j ) );
			
			arrIdx[ nIdxBufF + 0 ] = nIdxBufV + 0;
			arrIdx[ nIdxBufF + 1 ] = nIdxBufV + 1;
			arrIdx[ nIdxBufF + 2 ] = nIdxBufV + ( nDivA + 1 );
			arrIdx[ nIdxBufF + 3 ] = nIdxBufV + ( nDivA + 1 ) + 1;
			arrIdx[ nIdxBufF + 4 ] = nIdxBufV + ( nDivA + 1 );
			arrIdx[ nIdxBufF + 5 ] = nIdxBufV + 1;
		}
	}
	
	// Shift indices to the next area (the next face of cuboid)
	arrnIdx[ 0 ] = nIdxV + ( nDivA + 1 ) * ( nDivB + 1 );
	arrnIdx[ 1 ] = nIdxF + 2 * nDivA * nDivB;
	
	return 0;
}


// Building a mesh of cuboid which is divided into (gfX / gfPX) pieces 
// on x-direction, and so are gfPY, gfPZ, at (vecPos) with size gfSize
function myBuildRectCuboid(pPoly, gfX, gfY, gfZ, arrfColor, gfPX, gfPY, gfPZ, vecPos, gfSize)
{
	var gfLatX, gfLatY, gfLatZ;
	var nDivX, nDivY, nDivZ;
    
    var nNumVtx, nNumFace;
    var arrnIdx = [0, 0];
	
	nDivX = Math.floor( gfX / gfPX );
	nDivY = Math.floor( gfY / gfPY );
	nDivZ = Math.floor( gfZ / gfPZ );
	
	gfLatX = gfX / nDivX;
	gfLatY = gfY / nDivY;
	gfLatZ = gfZ / nDivZ;
    
	// Setting the number of vertices, edges, and faces
	// and the size of data
    nNumVtx = 2 * ( ( nDivX + 1 ) * ( nDivY + 1 ) + 
		( nDivY + 1 ) * ( nDivZ + 1 ) + ( nDivZ + 1 ) * ( nDivX + 1 ) );
    nNumFace = 2 * 2 * ( nDivX * nDivY + nDivY * nDivZ + nDivZ * nDivX );
	
	pPoly.setNumVtx(nNumVtx);
	pPoly.setNumFace(nNumFace);
    
	pPoly.setBufVtx(new Array(3 * nNumVtx));
	pPoly.setBufVtxOrg(new Array(3 * nNumVtx));
    
	pPoly.setBufNor(new Array(3 * nNumVtx));
	pPoly.setBufNorOrg(new Array(3 * nNumVtx));
    
	pPoly.setBufIdx(new Array(3 * nNumFace));
	
	//
	//              2----------3
	//             /|         /|
	//            / |        / |
	//           /  |       /  |
	//          6----------7   |
	//          |   0------|---1
	//          |  /       |  /
	//          | /        | /
	//     y    |/         |/
	//     |    4----------5
	//     | 
	//     O-----x
	//    /
	//   /
	//  z
	// 
	
	// Putting the verticee, edges and faces on (+z)-face
	myAddVFCuboidFace(pPoly, arrnIdx, nDivX, nDivY, 
		-gfX / 2.0, -gfY / 2.0,  gfZ / 2.0, gfLatX, 0, 0, 0, gfLatY, 0);
	
	// Putting the verticee, edges and faces on (+x)-face
	myAddVFCuboidFace(pPoly, arrnIdx, nDivZ, nDivY, 
		 gfX / 2.0, -gfY / 2.0,  gfZ / 2.0, 0, 0, -gfLatZ, 0, gfLatY, 0);
	
	// Putting the verticee, edges and faces on (-z)-face
	myAddVFCuboidFace(pPoly, arrnIdx, nDivX, nDivY, 
		 gfX / 2.0, -gfY / 2.0, -gfZ / 2.0, -gfLatX, 0, 0, 0, gfLatY, 0);
	
	// Putting the verticee, edges and faces on (-x)-face
	myAddVFCuboidFace(pPoly, arrnIdx, nDivZ, nDivY, 
		-gfX / 2.0, -gfY / 2.0, -gfZ / 2.0, 0, 0, gfLatZ, 0, gfLatY, 0);
	
	// Putting the verticee, edges and faces on (+y)-face
	myAddVFCuboidFace(pPoly, arrnIdx, nDivX, nDivZ, 
		-gfX / 2.0,  gfY / 2.0,  gfZ / 2.0, gfLatX, 0, 0, 0, 0, -gfLatZ);
	
	// Putting the verticee, edges and faces on (-y)-face
	myAddVFCuboidFace(pPoly, arrnIdx, nDivX, nDivZ, 
		-gfX / 2.0, -gfY / 2.0, -gfZ / 2.0, gfLatX, 0, 0, 0, 0, gfLatZ);
	
	// Setting the color
    pPoly.setColor(arrfColor);
	
	// Setting the position and size
    pPoly.setPos(vecPos);
	pPoly.setSize(gfSize);
	
	return 0;
}


