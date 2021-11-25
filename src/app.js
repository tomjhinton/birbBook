
import './style.scss'
import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { gsap } from 'gsap'

const txtgen = require('txtgen')

let bookTitle = txtgen.sentence()
let author =  txtgen.getNouns()

const blurb =  txtgen.paragraph()
// console.log(author[Math.floor(Math.random() * author.length)])


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
// fontsL.map(x => {
//
// })

console.log(document.fonts)

const canvasCover = document.createElement('canvas')
canvasCover.id = 'textBoxCover'
canvasCover.width = 1000
canvasCover.height = 1000
canvasCover.style.display = 'none'
document.body.appendChild(canvasCover)

const textTexture = document.getElementById('textBoxCover')

var ctx = canvasCover.getContext('2d')
ctx.fillStyle = 'white'
let font  = fonts[Math.floor(Math.random()* fonts.length)]

ctx.font = `40px ${fonts[Math.floor(Math.random()* fonts.length)]}`
if(font === 'Tapeworm' || font === 'ferrite'){
  ctx.font = '40px ' + font
}

ctx.fillText(bookTitle, 400, 200)

font = fonts[Math.floor(Math.random()* fonts.length)]
ctx.font = `30px ${font}`
console.log(ctx.font)
ctx.fillText( bookTitle.charAt(Math.floor(Math.random() * bookTitle.length)).toUpperCase() +' . ' +author[Math.floor(Math.random() * author.length)].toUpperCase(), 400, 400)

document.querySelector('#tone-play-toggle').addEventListener('click', (e) => {
  bookTitle = txtgen.sentence()
  author =  txtgen.getNouns()

  font = fonts[Math.floor(Math.random()* fonts.length)]
  ctx.font = `50px ${font}`;
  console.log(ctx.font)
  ctx.fillText( bookTitle.charAt(Math.floor(Math.random() * bookTitle.length)).toUpperCase() +' . ' +author[Math.floor(Math.random() * author.length)].toUpperCase(), 400, 400)

  ctx.fillText( bookTitle.charAt(Math.floor(Math.random() * bookTitle.length)).toUpperCase() +' . ' +author[Math.floor(Math.random() * author.length)].toUpperCase(), 400, 400)
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
    }
  },
  vertexShader: vertexShader,
  fragmentShader: fragCover,
  side: THREE.DoubleSide
})

const backMaterial  = new THREE.ShaderMaterial({
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
  fragmentShader: fragBack,
  side: THREE.DoubleSide
})

const spineMaterial  = new THREE.ShaderMaterial({
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

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

let sceneGroup, cover, pages, spine, back

const intersectsArr = []





gtlfLoader.load(
  'book.glb',
  (gltf) => {
    // gltf.scene.scale.set(24.5,24.5,24.5)
    sceneGroup = gltf.scene
    sceneGroup.needsUpdate = true
    // sceneGroup.position.y -= 4.5
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
