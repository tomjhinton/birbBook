
const float PI = 3.1415926535897932384626433832795;
const float TAU = PI * 2.;
uniform vec2 uResolution;
uniform vec2 uMouse;


varying vec2 vUv;
varying float vTime;


void main(){

  float alpha = 1.;
  vec2 uv = vUv - .5;


  vec3 color = vec3( mod(uv.x / uv.y,10.0));

 gl_FragColor =  vec4(color, alpha);

}
