# birbBook

For @sableRaph's weekly Creative Coding Challenge. The Challenge topic was Book Cover's with a "string -> image" diversifier.

- Grabbed a book from the bookgen package on Blender.
- Split it into front cover, back cover, spine and pages.
- Went looking for a text generation package.
- Found a truly dreadful text generation package.
- Used it anyway because it amused me.

Took a very route one approach and just counted the percentage of R's, G's & B's in the generated text. Then multiplied them because this result gave dull colors.

```
arr = blurb.split('')

backMaterial.uniforms.uColor.value.x = arr.filter(x =>{
  return x === 'r' || x === 'R'
}).length /arr.length * 20

backMaterial.uniforms.uColor.value.y = arr.filter(x =>{
  return x === 'g' || x === 'G'
}).length /arr.length * 20

backMaterial.uniforms.uColor.value.z = arr.filter(x =>{
  return x === 'b' || x === 'B'
}).length /arr.length * 20
```
- Passed this to shaders.
- Created canvas elements to post the text to.
- Realised that mapping the text well was going to be hard.(The uv's of the model were sort of a mess and using random fonts meant I'd need to work out line and word spacing for each)
- Found the bad results amusing.
- Kept them.

You can add a canvas element into your uniforms in three.js like ...

 ```
 uTexture: {
   value: new THREE.CanvasTexture(textTexture)
 },
 ```
- with the back cover I just used the RGB values from the text to make a color and turned it into a gradient by mulitplying by the uv.x
- Then I made it move because that's more fun.
- Yes I know book covers don't move.
- For the spine and pages I just made pretty patterns that I'd quite like to see on a book tbh.

With the front cover I used a couple of UV distorting functions.

- I mean wildly it's named usefully.
- Well I think so but my technical term knowledge is scattershot.
- But this one changes the UV into a nice circle thing.

```
vec2 getRadialUv(vec2 uv) {
	float angle = atan(uv.x, -uv.y);
	angle = abs(angle);
	vec2 radialUv = vec2(0.0);
	radialUv.x = angle / (PI * 2.0) + 0.5;
	radialUv.y = 1.0 - pow(1.0 - length(uv), 4.0);
	return radialUv;
}
```

- and this one adds a ripple effect.

```
void uvRipple(inout vec2 uv, float intensity){

	vec2 p =-1.+2.*vUv;


    float cLength=length(p);

     uv= uv +(p/cLength)*cos(cLength*15.0-vTime*1.0)*intensity;

}
```
- Then I added the title textures in in different colors using the new distorted uvs.

- A couple of things have been tweaked with the RGB uniforms. 
