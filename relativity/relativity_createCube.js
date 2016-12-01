function myPolygonData() {
    this.nNumVtx = 0;
    this.nNumFace = 0;
    
    this.arrgfColor = [1.0, 1.0, 1.0, 1.0];
    
    this.gfSize = 1.0;
    this.vecPos = [0.0, 0.0, 0.0];
}


function myAddVFCuboidFace(pPoly, arrnIdx, nDivA, nDivB, gfXInit, gfYInit, gfZInit, 
                           gfAddAX, gfAddAY, gfAddAZ, gfAddBX, gfAddBY, gfAddBZ)
{
	var i, j;
	
	var gfXCurr, gfYCurr, gfZCurr;
	var gfNX, gfNY, gfNZ, gfNormN;
    
	var nIdxBufV, nIdxBufN, nIdxBufF;
    var nIdxV, nIdxF;
    
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
			
			pPoly.pgfVtxOrg[ nIdxBufV + 0 ] = gfXCurr;
			pPoly.pgfVtxOrg[ nIdxBufV + 1 ] = gfYCurr;
			pPoly.pgfVtxOrg[ nIdxBufV + 2 ] = gfZCurr;
			
			pPoly.pgfNorOrg[ nIdxBufN + 0 ] = gfNX;
			pPoly.pgfNorOrg[ nIdxBufN + 1 ] = gfNY;
			pPoly.pgfNorOrg[ nIdxBufN + 2 ] = gfNZ;
			
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
			
			pPoly.pgunIdxFace[ nIdxBufF + 0 ] = nIdxBufV + 0;
			pPoly.pgunIdxFace[ nIdxBufF + 1 ] = nIdxBufV + 1;
			pPoly.pgunIdxFace[ nIdxBufF + 2 ] = nIdxBufV + ( nDivA + 1 );
			pPoly.pgunIdxFace[ nIdxBufF + 3 ] = nIdxBufV + ( nDivA + 1 ) + 1;
			pPoly.pgunIdxFace[ nIdxBufF + 4 ] = nIdxBufV + ( nDivA + 1 );
			pPoly.pgunIdxFace[ nIdxBufF + 5 ] = nIdxBufV + 1;
		}
	}
	
	// Shift indices to the next area (the next face of cuboid)
	arrnIdx[ 0 ] = nIdxV + ( nDivA + 1 ) * ( nDivB + 1 );
	arrnIdx[ 1 ] = nIdxF + 2 * nDivA * nDivB;
	
	return 0;
}


// Building a mesh of cuboid which is divided into (gfX / gfPX) pieces 
// on x-direction, and so are gfPY, gfPZ, at (gfPosX, gfPosY, gfPosZ) with size gfSize
function myBuildRectCuboid(pPoly, gfX, gfY, gfZ, arrfColor, 
                           gfPX, gfPY, gfPZ, gfPosX, gfPosY, gfPosZ, gfSize)
{
	var gfLatX, gfLatY, gfLatZ;
	var nDivX, nDivY, nDivZ;
    var arrnIdx = [0, 0];
	
	nDivX = Math.floor( gfX / gfPX );
	nDivY = Math.floor( gfY / gfPY );
	nDivZ = Math.floor( gfZ / gfPZ );
	
	gfLatX = gfX / nDivX;
	gfLatY = gfY / nDivY;
	gfLatZ = gfZ / nDivZ;
	
	// Setting the number of vertices, edges, and faces
	// and the size of data
	pPoly.nNumVtx = 2 * ( ( nDivX + 1 ) * ( nDivY + 1 ) + 
		( nDivY + 1 ) * ( nDivZ + 1 ) + ( nDivZ + 1 ) * ( nDivX + 1 ) );
	pPoly.nNumFace = 2 * 2 * ( nDivX * nDivY + nDivY * nDivZ + nDivZ * nDivX );
    
	pPoly.pgfVtx = new Array(3 * pPoly.nNumVtx);
	pPoly.pgfVtxOrg = new Array(3 * pPoly.nNumVtx);
    
	pPoly.pgfNor = new Array(3 * pPoly.nNumVtx);
	pPoly.pgfNorOrg = new Array(3 * pPoly.nNumVtx);
    
	pPoly.pgunIdxFace = new Array(3 * pPoly.nNumFace);
	
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
	pPoly.arrgfColor[ 0 ] = arrfColor[ 0 ];
	pPoly.arrgfColor[ 1 ] = arrfColor[ 1 ];
	pPoly.arrgfColor[ 2 ] = arrfColor[ 2 ];
	pPoly.arrgfColor[ 3 ] = arrfColor[ 3 ];
	
	// Setting the position and size
	pPoly.vecPos[ 0 ] = gfPosX;
	pPoly.vecPos[ 1 ] = gfPosY;
	pPoly.vecPos[ 2 ] = gfPosZ;
	pPoly.gfSize = gfSize;
	
	return 0;
}


