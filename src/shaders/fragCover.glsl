
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


void uvRipple(inout vec2 uv, float intensity){

	vec2 p =-1.+2.*vUv;


    float cLength=length(p);

     uv= uv +(p/cLength)*cos(cLength*15.0-vTime*1.0)*intensity;

}


void main(){
  float alpha = 1.;
  vec2 uv = vUv;

  vec2 uvT = getRadialUv(uv -.5);
	vec2 rote = rotateUV(uvT, vec2(.5), PI * vTime * .05);
  vec2 roteC = rotateUV(vUv, vec2(.5), -PI * vTime * .05);
  vec2 uvT2 = getRadialUv(roteC - .4);

  vec4 hex_uv2 = getHex(uvT2 * 3.);

  vec4 tex = texture2D(uTexture, vUv);

  vec2 uvT3 = getRadialUv(hex_uv2.xy -.5);


  vec4 hex_uv3 = getHex(uvT3 * 12.);

  float hexf3 = stroke(hex(hex_uv3.xy * uColor.b),uColor.g, uColor.r );


  float tri = triangleGrid(uvT2, uColor.r, uColor.g/ 1000., uColor.b  );

  vec3 color = vec3( 1.)  ;

  vec2 uvR = vUv - uColor.b;
  uvRipple(uvR  , uColor.r);

  uvRipple(hex_uv3.xy, uColor.b);
  color.r = texture2D(uTexture, uvT3).r;
  color.g = texture2D(uTexture, uvR).r;
  color.b = texture2D(uTexture, uvT2).r;


  color = mix(color, 1.-color, tex.r);
  color = mix(color, 1.-color, hexf3);


 gl_FragColor =  vec4(color, 1.);

}
