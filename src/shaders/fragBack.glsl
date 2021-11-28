
const float PI = 3.1415926535897932384626433832795;
const float TAU = PI * 2.;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform vec3 uColor;

varying vec2 vUv;
varying float vTime;



void coswarp(inout vec3 trip, float warpsScale ){

  trip.xyz += warpsScale * .1 * cos(3. * trip.yzx + (vTime * .25));
  trip.xyz += warpsScale * .05 * cos(11. * trip.yzx + (vTime * .25));
  trip.xyz += warpsScale * .025 * cos(17. * trip.yzx + (vTime * .25));
}




void main(){
  const int one = 1;
  float alpha = 1.;
  vec2 uv = vUv;


  vec3 color = vec3( 0.);


    uv.y = 1. - uv.y;
    vec4 tex = texture2D(uTexture, uv);
    color = uColor * uv.x;

    coswarp(color, 3.);
    color = mix(color, 1.-color, tex.r);


 gl_FragColor =  vec4(color, alpha);

}
