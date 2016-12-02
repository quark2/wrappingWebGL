/*
   The following codes are from 
   
   http://stackoverflow.com/questions/180/function-for-creating-color-wheels
*/


function myToRGB1(rm1, rm2, rh) {
    if      (rh > 360.0) rh -= 360.0;
    else if (rh <   0.0) rh += 360.0;
    
    if      (rh <  60.0) rm1 = rm1 + (rm2 - rm1) * rh / 60.0;
    else if (rh < 180.0) rm1 = rm2;
    else if (rh < 240.0) rm1 = rm1 + (rm2 - rm1) * (240.0 - rh) / 60.0;
    
    return rm1;
}


function myHSL2RGB(clrHSL, clrRGB)
{
    var saturation, luminance, hue;
    var rm1, rm2;
    
    saturation = clrHSL[ 1 ] / 100.0;
    luminance = clrHSL[ 2 ] / 100.0;
    hue = clrHSL[ 0 ];
    
    if (saturation == 0.0) {
        clrRGB[ 0 ] = clrRGB[ 1 ] = clrRGB[ 2 ] = luminance;
    } else {
        if (luminance <= 0.5) {
            rm2 = luminance + luminance * saturation;
        } else {
            rm2 = luminance + saturation - luminance * saturation;
        }
        
        rm1 = 2.0 * luminance - rm2;
        
        clrRGB[ 0 ] = myToRGB1(rm1, rm2, hue + 120.0);
        clrRGB[ 1 ] = myToRGB1(rm1, rm2, hue);
        clrRGB[ 2 ] = myToRGB1(rm1, rm2, hue - 120.0);
    }
    
    return clrRGB;
}


