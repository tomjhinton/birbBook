


const float PI = 3.1415926535897932384626433832795;
const float TAU = PI * 2.;

uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColor;


uniform sampler2D uTexture;


varying vec2 vUv;
varying float vTime;

const vec2 v60 = vec2( cos(PI/3.0), sin(PI/3.0));
const vec2 vm60 = vec2(cos(-PI/3.0), sin(-PI/3.0));
const mat2 rot60 = mat2(v60.x,-v60.y,v60.y,v60.x);
const mat2 rotm60 = mat2(vm60.x,-vm60.y,vm60.y,vm60.x);

float stroke(float x, float s, float w){
  float d = step(s, x+ w * .5) - step(s, x - w * .5);
  return clamp(d, 0., 1.);
}


void coswarp(inout vec3 trip, float warpsScale ){

  trip.xyz += warpsScale * .1 * cos(3. * trip.yzx + (vTime * .25));
  trip.xyz += warpsScale * .05 * cos(11. * trip.yzx + (vTime * .25));
  trip.xyz += warpsScale * .025 * cos(17. * trip.yzx + (vTime * .25));
}


float aastep(float threshold, float value) {

    float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
    return smoothstep(threshold-afwidth, threshold+afwidth, value);

}

float fill(float x, float size) {
    return 1.-aastep(size, x);
}



vec2 getRadialUv(vec2 uv) {
	float angle = atan(uv.x, -uv.y);
	angle = abs(angle);
	vec2 radialUv = vec2(0.0);
	radialUv.x = angle / (PI * 2.0) + 0.5;
	radialUv.y = 1.0 - pow(1.0 - length(uv), 4.0);
	return radialUv;
}


float triangleGrid(vec2 p, float stepSize,float vertexSize,float lineSize)
{
    // equilateral triangle grid
    vec2 fullStep= vec2( stepSize , stepSize*v60.y);
    vec2 halfStep=fullStep/2.0;
    vec2 grid = floor(p/fullStep);
    vec2 offset = vec2( (mod(grid.y,2.0)==1.0) ? halfStep.x : 0. , 0.);
   	// tiling
    vec2 uv = mod(p+offset,fullStep)-halfStep;
    float d2=dot(uv,uv);
    return vertexSize/d2 + // vertices
    	max( abs(lineSize/(uv*rotm60).y), // lines -60deg
        	 max ( abs(lineSize/(uv*rot60).y), // lines 60deg
        	  	   abs(lineSize/(uv.y)) )); // h lines
}

vec2 rotateUV(vec2 uv, vec2 pivot, float rotation) {
  mat2 rotation_matrix=mat2(  vec2(sin(rotation),-cos(rotation)),
                              vec2(cos(rotation),sin(rotation))
                              );
  uv -= pivot;
  uv= uv*rotation_matrix;
  uv += pivot;
  return uv;
}

const vec2 s = vec2(1, 1.7320508);


float hex(in vec2 p){

		 p = abs(p);

		 return max(dot(p, s*.5), p.x); // Hexagon.

 }
vec4 getHex(vec2 p){

		 vec4 hC = floor(vec4(p, p - vec2(.5, 1))/s.xyxy) + .5;

		 vec4 h = vec4(p - hC.xy*s, p - (hC.zw + .5)*s);

		 return dot(h.xy, h.xy)<dot(h.zw, h.zw) ? vec4(h.xy, hC.xy) : vec4(h.zw, hC.zw + vec2(.5, 1));

 }


 float box(vec2 _st, vec2 _size, float _smoothEdges){
    _size = vec2(0.5)-_size*0.5;
    vec2 aa = vec2(_smoothEdges*0.5);
    vec2 uv = smoothstep(_size,_size+aa,_st);
    uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
    return uv.x*uv.y;
}

float wiggly(float cx, float cy, float amplitude, float frequency, float spread){

  float w = sin(cx * amplitude * frequency * PI) * cos(cy * amplitude * frequency * PI) * spread;

  return w;
}

void uvRipple(inout vec2 uv, float intensity){

	vec2 p =-1.+2.*vUv;


    float cLength=length(p);

     uv= uv +(p/cLength)*cos(cLength*15.0-vTime*1.0)*intensity;

}
//	Classic Perlin 2D Noise
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}


vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

vec2 brownConradyDistortion(in vec2 uv, in float k1, in float k2)
{
uv = uv * 2.0 - 1.0;	// brown conrady takes [-1:1]

// positive values of K1 give barrel distortion, negative give pincushion
float r2 = uv.x*uv.x + uv.y*uv.y;
uv *= 1.0 + k1 * r2 + k2 * r2 * r2;

// tangential distortion (due to off center lens elements)
// is not modeled in this function, but if it was, the terms would go here

uv = (uv * .5 + .5);	// restore -> [0:1]
return uv;
}

// const vec2 v60 = vec2( cos(PI/3.0), sin(PI/3.0));
//       const vec2 vm60 = vec2(cos(-PI/3.0), sin(-PI/3.0));
//       const mat2 rot60 = mat2(v60.x,-v60.y,v60.y,v60.x);
//       const mat2 rotm60 = mat2(vm60.x,-vm60.y,vm60.y,vm60.x);
//
//       float triangleGrid(vec2 p, float stepSize,float vertexSize,float lineSize)
//       {
//   // equilateral triangle grid
//   vec2 fullStep= vec2( stepSize , stepSize*v60.y);
//   vec2 halfStep=fullStep/2.0;
//   vec2 grid = floor(p/fullStep);
//   vec2 offset = vec2( (mod(grid.y,2.0)==1.0) ? halfStep.x : 0. , 0.);
//   // tiling
//   vec2 uv = mod(p+offset,fullStep)-halfStep;
//   float d2=dot(uv,uv);
//   return vertexSize/d2 + // vertices
//     max( abs(lineSize/(uv*rotm60).y), // lines -60deg
//          max ( abs(lineSize/(uv*rot60).y), // lines 60deg
//                abs(lineSize/(uv.y)) )); // h lines
//              }

void main(){
  float alpha = 1.;
  vec2 uv = vUv;

  vec2 uvT = getRadialUv(uv -.5);
	vec2 rote = rotateUV(uvT, vec2(.5), PI * vTime * .05);
  vec2 roteC = rotateUV(vUv, vec2(.5), -PI * vTime * .05);
  vec2 uvT2 = getRadialUv(roteC - .4);
  vec2 uvT4 = getRadialUv(rote -.5);
  // uvRipple(uvT2, .1);





  vec4 hex_uv2 = getHex(uvT2 * 3.);

    vec4 tex = texture2D(uTexture, vUv);

  vec2 uvT3 = getRadialUv(hex_uv2.xy -.5);

  float hexf2 = stroke(hex(hex_uv2.xy), .5, .3);


  vec4 hex_uv3 = getHex(uvT3 * 12.);

  float hexf3 = stroke(hex(hex_uv3.xy * uColor.b),uColor.g, uColor.r );

	float r = fill(triangleGrid(rote, 0.1 , 0.0000005,0.001), .01);

  float g = fill(stroke(triangleGrid(uvT4, .2 , 0.0000005, 0.009), .9, 1.), .1);

  float g2 = stroke(triangleGrid(uvT2, .2 , 0.000005,0.009), .5, .2);

    float g3 = stroke(triangleGrid(rote, uColor.b + wiggly(uvT2.x + vTime * .005, uvT3.y + vTime * .005, 9., 3., 0.05), uColor.r /100. ,0.009), .5, .5);

  //   vec3 uColor2 = uColor;
  // uvRipple(uColor2.rg, 1.5);

  float tri = triangleGrid(uvT2, uColor.r, uColor.g/ 1000., uColor.b  );

  vec3 color = vec3( 1.)  ;



  vec2 uvR = vUv - uColor.b;
  uvRipple(uvR  , uColor.r);

  uvRipple(hex_uv3.xy, uColor.b);
  color.r = texture2D(uTexture, uvT3).r;
  color.g = texture2D(uTexture, uvR).r;
  color.b = texture2D(uTexture, uvT2).r;

  // color.rb = brownConradyDistortion(color.rb, sin(vTime), cos(vTime));





  //
  // if(color == vec3(0)){
  //   color = color2;
  // }

  color = mix(color, 1.-color, tex.r);
  color = mix(color, 1.-color, hexf3);


 gl_FragColor =  vec4(color, 1.);

}
