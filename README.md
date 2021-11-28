# birbBook

For @sableRaph's weekly Creative Coding Challenge. The Challenge topic was Book Cover's with a "string -> image" diversifier.

- Grabbed a book from the bookgen package on Blender.
- Split it into front cover, back cover, spine and pages.
- Went looking for a text generation package.
- Found a truly dreadful text generation package.
- Used it anyway because it amused me.

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
