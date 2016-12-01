function myEvalVec(vecDst, gfX, gfY, gfZ) {
	vecDst[ 0 ] = gfX;
	vecDst[ 1 ] = gfY;
	vecDst[ 2 ] = gfZ;
    
    return vecDst;
}


function myCopyVec(vecDst, vecSrc) {
	vecDst[ 0 ] = vecSrc[ 0 ];
	vecDst[ 1 ] = vecSrc[ 1 ];
	vecDst[ 2 ] = vecSrc[ 2 ];
    
    return vecDst;
}


function myCopyVecFromBuf(vecDst, arrBuf, nIdx) {
	vecDst[ 0 ] = arrBuf[ nIdx + 0 ];
	vecDst[ 1 ] = arrBuf[ nIdx + 1 ];
	vecDst[ 2 ] = arrBuf[ nIdx + 2 ];
    
    return vecDst;
}


function myAddVec(vecDst, vecAdd) {
	vecDst[ 0 ] += vecAdd[ 0 ];
	vecDst[ 1 ] += vecAdd[ 1 ];
	vecDst[ 2 ] += vecAdd[ 2 ];
    
    return vecDst;
}


function mySubVec(vecDst, vecSub) {
	vecDst[ 0 ] -= vecSub[ 0 ];
	vecDst[ 1 ] -= vecSub[ 1 ];
	vecDst[ 2 ] -= vecSub[ 2 ];
    
    return vecDst;
}


function myMulVec(vecDst, gfMul) {
	vecDst[ 0 ] *= gfMul;
	vecDst[ 1 ] *= gfMul;
	vecDst[ 2 ] *= gfMul;
    
    return vecDst;
}


function myGetLenVec(vec) {
	return Math.sqrt(vec[ 0 ] * vec[ 0 ] + vec[ 1 ] * vec[ 1 ] + vec[ 2 ] * vec[ 2 ]);
}


function myNormalizeVec(vec) {
	return myMulVec(vec, 1.0 / myGetLenVec(vec));
}


function myApplyLorentzTransToPoint(vecDst, vecSrc, gfVel, gfGamma) {
	var gfR;
	
	// Beware; To determine the sign of the second term, you should consider 
	// the effect of the coordinate system of OpenGL.
	vecDst[ 0 ] = vecSrc[ 0 ];
	vecDst[ 1 ] = vecSrc[ 1 ];
	vecDst[ 2 ] = gfGamma * vecSrc[ 2 ] - gfGamma * gfVel * myGetLenVec(vecSrc);
	
	return vecDst;
}


function myApplyLorentzTransformation(pPoly, vecPosCamera, gfVel, gfGamma) {
	var i;
	
	var vecPos = new Array(3), vecNor = new Array(3);
    var vecPosCenter = new Array(3);
    
    var arrVtx, arrNor;
	
	var nIdxVtx;
	var gfR;
	
	pPoly.getPos(vecPosCenter);
	mySubVec(vecPosCenter, vecPosCamera);
    
    arrVtx = pPoly.getBufVtx();
    arrNor = pPoly.getBufNor();
	
	// Transforming point and normal vectors of each vertices
	for ( i = 0 ; i < pPoly.getNumVtx() ; i++ ) {
		nIdxVtx = 3 * i;
		
		// Getting the position of each vertex from camera
		myCopyVecFromBuf(vecPos, pPoly.getBufVtxOrg(), nIdxVtx);
        myAddVec(vecPos, vecPosCenter);
        
		// Getting the normal vector plus position of each vertex from camera
        myCopyVecFromBuf(vecNor, pPoly.getBufNorOrg(), nIdxVtx);
		myAddVec(vecNor, vecPos);
		
		// Lorentz-transformation!
		myApplyLorentzTransToPoint(vecPos, vecPos, gfVel, gfGamma);
		
		// Evaluating
        arrVtx[ nIdxVtx + 0 ] = vecPos[ 0 ];
        arrVtx[ nIdxVtx + 1 ] = vecPos[ 1 ];
        arrVtx[ nIdxVtx + 2 ] = vecPos[ 2 ];
		
		// The following codes are transforming the normal vector.
		// The method is as following: add the normal vector to the position and 
		// transform it, and then substract the transformed position vector (+normalization).
		// Although it is not the precise transformation of normal vector, 
		// it may be an alternative way; in general case normal vectors are not 
		// determined only the geometry of polygon.
		myApplyLorentzTransToPoint(vecNor, vecNor, gfVel, gfGamma);
        mySubVec(vecNor, vecPos)
		myNormalizeVec(vecNor);
		
		// Evaluating
        arrNor[ nIdxVtx + 0 ] = vecNor[ 0 ];
        arrNor[ nIdxVtx + 1 ] = vecNor[ 1 ];
        arrNor[ nIdxVtx + 2 ] = vecNor[ 2 ];
	}
	
	return 0;
}


/*function mySetFrame(pglInfo) {
	int i;
	
	GLfloat gfMom, gfVel, gfGamma;
	
	GLfloat gfTime = 1.0f / g_nFPS;
	
	gfMom = pglInfo.gfMomentum;
	gfVel = gfMom / sqrt(1 + gfMom * gfMom);
	gfGamma = 1.0f / sqrt(1 - gfVel * gfVel);
	
	// Beware; the orientalization of z-axis
	pglInfo.vecPos[ 2 ] -= gfVel * gfTime;
	
	for ( i = 0 ; i < pglInfo.nNumObj ; i++ ) {
		myApplyLorentzTransformation(&pglInfo.arrPolys[ i ], 
			pglInfo.vecPos, gfVel, gfGamma);
	}
	
	return 0;
}*/


