
import './style.scss'
import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { gsap } from 'gsap'

const txtgen = require('txtgen')

let bookTitle = txtgen.sentence()
let author =  txtgen.getNouns()

let blurb =  txtgen.paragraph()


const canvas = document.querySelector('canvas.webgl')

import vertexShader from './shaders/vert.glsl'

import fragBack from './shaders/fragBack.glsl'

import fragCover from './shaders/fragCover.glsl'

import fragSpine from './shaders/fragSpine.glsl'

import fragPages from './shaders/fragPages.glsl'



const passio = new FontFace('Passio', 'url(Passio-Graphis.otf)')

const olondona = new FontFace('Olondona', 'url(Olondona.otf)')

const tapeworm = new FontFace('Tapeworm', 'url(Tapeworm-Regular.otf)')

const murmure = new FontFace('murmure', 'url(le-murmure.otf)')

const ferrite = new FontFace('ferrite', 'url(FerriteCoreDX-Regular.otf)')

const fontsL = [passio, olondona, tapeworm, murmure, ferrite]

const fonts = ['Passio', 'Olondona', 'Tapeworm', 'murmure', 'ferrite']


fontsL.map(x =>{
  document.fonts.add(x)
})



const scene = new THREE.Scene()


const canvasCover = document.createElement('canvas')
canvasCover.id = 'textBoxCover'
canvasCover.width = 500
canvasCover.height = 500
canvasCover.style.display = 'none'
document.body.appendChild(canvasCover)

const textTexture = document.getElementById('textBoxCover')

var ctx = canvasCover.getContext('2d')
ctx.fillStyle = 'white'
let font  = fonts[Math.floor(Math.random()* fonts.length)]

ctx.font = `15px ${fonts[Math.floor(Math.random()* fonts.length)]}`
if(font === 'Tapeworm' || font === 'ferrite'){
  ctx.font = '15px ' + font
}

ctx.fillText(bookTitle, 200, 100)

font = fonts[Math.floor(Math.random()* fonts.length)]
ctx.font = `30px ${font}`

ctx.fillText( bookTitle.charAt(Math.floor(Math.random() * bookTitle.length)).toUpperCase() +' . ' +author[Math.floor(Math.random() * author.length)].toUpperCase(), 330, 400)




//Blurb
const canvasBack = document.createElement('canvas')
canvasBack.id = 'textBoxBack'
canvasBack.width = 1000
canvasBack.height = 1000
canvasBack.style.display = 'none'
document.body.appendChild(canvasBack)

const textTextureBack = document.getElementById('textBoxBack')

const ctx2 = canvasBack.getContext('2d')
ctx2.fillStyle = 'white'
font  = fonts[Math.floor(Math.random()* fonts.length)]

ctx2.font = `40px ${fonts[Math.floor(Math.random()* fonts.length)]}`

let start = [400, 50]
let arr = blurb.split(' ')
for(let i = 1; i< arr.length; i++){
  if(i%5 !== 0){
    start[0]+= arr[i].length + 60
    ctx2.fillText(arr[i], start[0], start[1])

  }
  if(i%5 === 0){
    start[0]=400
    start[1] +=40
    ctx2.fillText(arr[i], start[0], start[1])

  }
}


//Spine
const wrapDiv = document.createElement('div')

const canvasSpine = document.createElement('canvas')
document.body.appendChild(canvasSpine)


canvasSpine.parentNode.insertBefore(wrapDiv, canvasSpine)
wrapDiv.appendChild(canvasSpine)
canvasSpine.id = 'textBoxSpine'
canvasSpine.width = 100
canvasSpine.height = 100
wrapDiv.classList.add('x')
canvasSpine.classList.add('y')
// canvasSpine.style.position= 'absolute'

const textTextureSpine = document.getElementById('textBoxSpine')
let base_image = new Image(100, 100);
base_image.src = './birb.png';
let ctx3 = canvasSpine.getContext('2d')



base_image.onload = function(){
  ctx3.scale(.5, .5)
  ctx3.drawImage(base_image, 0, 0)

  spineMaterial.uniforms.uTexture.value = new THREE.CanvasTexture(textTextureSpine)

  textTextureSpine.addEventListener('click', function (e) {

    // gsap.to(sceneGroup.rotation, {
    //   duration: 3,
    //   z: sceneGroup.rotation.z - 3.5
    // })

    const color = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255
    }

    const color2 = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255
    }


    document.body.style.backgroundImage = `
    linear-gradient(rgba(${color.r}, ${color.g}, ${color.b}, .7)  .1em, transparent .2em), linear-gradient(90deg, rgba(${color2.r}, ${color2.g}, ${color2.b}, .7) .1em, transparent .2em)
    `



    //
    // controls.target.set(sceneGroup.position.x, sceneGroup.position.y, sceneGroup.position.z)
    // // camera.lookAt(sceneGroup.position)
    // controls.update()
  })

}





document.querySelector('#tone-play-toggle').addEventListener('click', (e) => {
  bookTitle = txtgen.sentence()
  author =  txtgen.getNouns()
  ctx.clearRect(0, 0, 1000, 1000)
  font = fonts[Math.floor(Math.random()* fonts.length)]

  coverMaterial.uniforms.uColor.value.x = bookTitle.split('').filter(x =>{
    return x === 'r' || x === 'R'
  }).length /bookTitle.length * 10.

  coverMaterial.uniforms.uColor.value.y = bookTitle.split('').filter(x =>{
    return x === 'g' || x === 'G'
  }).length /bookTitle.length * 10.

  coverMaterial.uniforms.uColor.value.z = bookTitle.split('').filter(x =>{
    return x === 'b' || x === 'B'
  }).length /bookTitle.length * 10.

  start = [100, 50]
  arr = bookTitle.split(' ')
  ctx.font = `30px ${font}`;

  for(let i = 0; i< arr.length; i++){
    if(i%5 !== 0){
      start[0]+= 70 +arr[i-1].length
      ctx.fillText(arr[i], start[0], start[1])

    }
    if(i%5 === 0){
      start[0]=100
      start[1] +=40
      ctx.fillText(arr[i], start[0], start[1], 10)

    }
  }
  // ctx.fillText(bookTitle, 200, 100)

  font = fonts[Math.floor(Math.random()* fonts.length)]
  ctx.font = `30px ${font}`
  ctx.fillText( String.fromCharCode(Math.floor(Math.random() * 26 + 65)) +' . ' +author[Math.floor(Math.random() * author.length)].toUpperCase(), 330, 400)

  blurb =  txtgen.paragraph()
  start = [400, 50]
  arr = blurb.split(' ')
  ctx2.fillStyle = 'white'
  ctx2.clearRect(0, 0, 1000, 1000)
  ctx2.font = `30px ${font}`
  for(let i = 1; i< arr.length; i++){
    if(i%5 !== 0){
      start[0]+= arr[i].length + 60
      ctx2.fillText(arr[i], start[0], start[1])

    }
    if(i%5 === 0){
      start[0]=400
      start[1] +=40
      ctx2.fillText(arr[i], start[0], start[1])

    }
  }


  arr = blurb.split('')
  backMaterial.uniforms.uColor.value.x = arr.filter(x =>{
    return x === 'r' || x === 'R'
  }).length / arr.length * 20

  backMaterial.uniforms.uColor.value.y = arr.filter(x =>{
    return x === 'g' || x === 'G'
  }).length / arr.length * 20

  backMaterial.uniforms.uColor.value.z = arr.filter(x =>{
    return x === 'b' || x === 'B'
  }).length / arr.length * 20



  coverMaterial.uniforms.uTexture.value = new THREE.CanvasTexture(textTexture)
  backMaterial.uniforms.uTexture.value = new THREE.CanvasTexture(textTextureBack)
})


// Loading Bar Stuff

const loadingBarElement = document.querySelector('.loading-bar')
const loadingBarText = document.querySelector('.loading-bar-text')
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () =>{
    window.setTimeout(() =>{
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

      loadingBarElement.classList.add('ended')
      loadingBarElement.style.transform = ''

      loadingBarText.classList.add('fade-out')

    }, 500)
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) =>{
    const progressRatio = itemsLoaded / itemsTotal
    loadingBarElement.style.transform = `scaleX(${progressRatio})`

  }
)

const gtlfLoader = new GLTFLoader(loadingManager)

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
  depthWrite: false,
  uniforms:
    {
      uAlpha: { value: 1 }
    },
  transparent: true,
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
  uniform float uAlpha;
        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})

const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


//Materials

const coverMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uMouse: {
      value: {x: 0.5, y: 0.5}
    },
    uTexture: {
      value: new THREE.CanvasTexture(textTexture)
    },
    uColor: {
      value: {x: 0.1, y: 0.5, z: 1.}
    }
  },
  vertexShader: vertexShader,
  fragmentShader: fragCover,
  side: THREE.DoubleSide
})


coverMaterial.uniforms.uColor.value.x = bookTitle.split('').filter(x =>{
  return x === 'r' || x === 'R'
}).length /bookTitle.length * 10.

coverMaterial.uniforms.uColor.value.y = bookTitle.split('').filter(x =>{
  return x === 'g' || x === 'G'
}).length /bookTitle.length * 10.

coverMaterial.uniforms.uColor.value.z = bookTitle.split('').filter(x =>{
  return x === 'b' || x === 'B'
}).length /bookTitle.length * 10.

const backMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uMouse: {
      value: {x: 0.5, y: 0.5}
    },
    uColor: {
      value: {x: 0.1, y: 0.5, z: 1.}
    },
    uTexture: {
      value: new THREE.CanvasTexture(textTextureBack)
    }
  },
  vertexShader: vertexShader,
  fragmentShader: fragBack,
  side: THREE.DoubleSide
})

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



const spineMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uMouse: {
      value: {x: 0.5, y: 0.5}
    },
    uTexture: {
      value: new THREE.CanvasTexture(textTextureSpine)
    }
  },
  vertexShader: vertexShader,
  fragmentShader: fragSpine,
  side: THREE.DoubleSide
})

const pagesMaterial  = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: true,
  uniforms: {
    uTime: { value: 0},
    uResolution: { type: 'v2', value: new THREE.Vector2() },
    uMouse: {
      value: {x: 0.5, y: 0.5}
    }
  },
  vertexShader: vertexShader,
  fragmentShader: fragPages,
  side: THREE.DoubleSide
})

const materialArrays = [pagesMaterial, spineMaterial, coverMaterial, backMaterial]


//Resizing handler

window.addEventListener('resize', () =>{



  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2 ))


})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, .1, 2000)
camera.position.x = -5
camera.position.y = 20
camera.position.z = 15
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Stops you looking under the model, because it's never polite to peak under someones model.
// controls.maxPolarAngle = Math.PI / 2 - 0.1

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0x000000, .0)


const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

let sceneGroup, cover, pages, spine, back


gtlfLoader.load(
  'book2.glb',
  (gltf) => {
    sceneGroup = gltf.scene
    sceneGroup.needsUpdate = true
    scene.add(sceneGroup)

    cover = gltf.scene.children.find((child) => {
      return child.name === 'cover'
    })

    spine = gltf.scene.children.find((child) => {
      return child.name === 'spine'
    })

    back = gltf.scene.children.find((child) => {
      return child.name === 'back'
    })

    pages = gltf.scene.children.find((child) => {
      return child.name === 'pages'
    })
    // intersectsArr.push(room)
    cover.material = coverMaterial
    spine.material = spineMaterial
    back.material = backMaterial
    pages.material = pagesMaterial


  }
)


//Animation stuff.

const clock = new THREE.Clock()
let oldElapsedTime = 0
const tick = () =>{
  // if ( mixer ) mixer.update( clock.getDelta() )
  const elapsedTime = clock.getElapsedTime()

  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  materialArrays.map(x=> {
    x.uniforms.uTime.value = elapsedTime
  })

  // Update controls

  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
