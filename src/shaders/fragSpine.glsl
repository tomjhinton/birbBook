


const float PI = 3.1415926535897932384626433832795;
const float TAU = PI * 2.;

uniform vec2 uResolution;
uniform vec2 uMouse;
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


float wiggly(float cx, float cy, float amplitude, float frequency, float spread){

  float w = sin(cx * amplitude * frequency * PI) * cos(cy * amplitude * frequency * PI) * spread;

  return w;
}



vec2 pMod2(inout vec2 p, vec2 size) {
    vec2 c = floor((p + size*0.5)/size);
    p = mod(p + size*0.5,size) - size*0.5;
    return c;
}


void main(){
  float alpha = 1.;
  vec2 uv = vUv;
  vec2 uv2 = vUv;
  uv2 = pMod2(uv2, vec2(8., 8.));

  vec2 uvT = getRadialUv(uv -.5);
	vec2 rote = rotateUV(uv, vec2(.5), PI * vTime * .05);
  vec2 roteC = rotateUV(vUv, vec2(.5), -PI * vTime * .05);
  vec2 uvT2 = getRadialUv(roteC - 1.);
  vec2 uvT4 = getRadialUv(rote -.5);


  vec4 hex_uv2 = getHex(uvT2 * 5.);
  vec2 uvT3 = getRadialUv(hex_uv2.xy -.5);
  float hexf2 = stroke(hex(hex_uv2.xy), .5, .3);
  vec4 hex_uv3 = getHex(uvT3 * 2.);
  float hexf3 = stroke(hex(hex_uv3.xy), .1, .5 );

	float r = fill(triangleGrid(rote, 0.1 , 0.00005,0.001), .2);

  float g = stroke(triangleGrid(uvT4, .2 , 0.0000005, 0.009), .5, 1.);


  float g3 = stroke(triangleGrid(rote, .5 + wiggly(uvT2.x + vTime * .005, uvT3.y + vTime * .005, 9., 3., 0.05), 0.0000005,0.009), .5, .1);


  vec3 color = vec3(1.);

  color = mix(color, 1.-color, hexf3);
  color = mix(color, 1.-color, hexf2);
  color = mix(color, 1.-color, g);
  color = mix(color, 1.-color, mix(g3, r, hexf2));


 gl_FragColor = vec4(color, 1.)  ;

}
