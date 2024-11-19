// Import required Three.js modules for silver-toned scene
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';

// Create scene, camera and get canvas element
const scene = new THREE.Scene();
scene.background = null; // Set background to null for transparency
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
const canvas = document.querySelector('.canvas');

// Track mouse position
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Add mouse move listener
document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
});

// Load HDRI environment map for realistic reflections
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/pond_bridge_night_2k.hdr', function(texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

// GSAP animation for navbar
const navbar = document.querySelector('.nav');
gsap.from(navbar, {
  y: -100,
  opacity: 0,
  duration: 1.5,
  ease: 'power2.inOut',
});
const canva = document.querySelector('.canvas');
gsap.from(canva, {
  y: 700,
  opacity: 0,
  duration: 5
});

// Optimize lighting setup for better performance while maintaining quality
const ambientLight = new THREE.AmbientLight(0xC0C0C0, 5); // Increased intensity
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xC0C0C0, 10); // Increased intensity
keyLight.position.set(5, 5, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048; // Increased shadow map resolution
keyLight.shadow.mapSize.height = 2048;
scene.add(keyLight);

// Reduced number of lights for better performance
const fillLight = new THREE.PointLight(0xC0C0C0, 7); // Increased intensity to compensate
fillLight.position.set(-5, 0, -5);
scene.add(fillLight);

// Enhanced silver material settings
const silverSettings = {
  color: '#C0C0C0',
  roughness: 0.05, // Reduced for better reflections
  metalness: 1.0,
  envMapIntensity: 4.0 // Increased for stronger reflections
};

// Optimized material update function
function updateSilverMaterial() {
  const updateMaterial = (child) => {
    if (child.isMesh && child.material) {
      child.material.color = new THREE.Color(silverSettings.color);
      child.material.roughness = silverSettings.roughness;
      child.material.metalness = silverSettings.metalness;
      child.material.envMapIntensity = silverSettings.envMapIntensity;
      child.material.needsUpdate = true;
    }
  };

  [helmetModel, swordModel, newModel].forEach(model => {
    if (model) model.traverse(updateMaterial);
  });
}

// Optimized model loading
const loader = new GLTFLoader();
let helmetModel, swordModel, newModel;

// Load helmet with optimized settings
loader.load(
  'helmet-future/source/1.glb',
  function (gltf) {
    helmetModel = gltf.scene;
    helmetModel.scale.set(10, 10, 10);
    helmetModel.position.set(0, 8, 0); // Moved up on y axis
    scene.add(helmetModel);

    helmetModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.color = new THREE.Color(silverSettings.color);
        child.material.roughness = silverSettings.roughness;
        child.material.metalness = silverSettings.metalness;
        child.material.envMapIntensity = silverSettings.envMapIntensity;
      }
    });
  },
  (xhr) => console.log('Helmet: ' + (xhr.loaded / xhr.total * 100) + '% loaded'),
  (error) => console.error('Error loading helmet:', error)
);

// Load sword with optimized settings
loader.load(
  './sword/scene.gltf',
  function (gltf) {
    swordModel = gltf.scene;
    swordModel.scale.set(1, 1, 1);
    swordModel.position.set(2, 8, 0); // Moved up on y axis
    scene.add(swordModel);

    swordModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.color = new THREE.Color(silverSettings.color);
        child.material.roughness = silverSettings.roughness;
        child.material.metalness = silverSettings.metalness;
        child.material.envMapIntensity = silverSettings.envMapIntensity;
      }
    });
  },
  (xhr) => console.log('Sword: ' + (xhr.loaded / xhr.total * 100) + '% loaded'),
  (error) => console.error('Error loading sword:', error)
);

// Load additional model with optimized settings
loader.load(
  './path/to/your/model.glb',
  function (gltf) {
    newModel = gltf.scene;
    newModel.scale.set(1, 1, 1);
    newModel.position.set(0, 8, 0); // Moved up on y axis
    scene.add(newModel);

    newModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.color = new THREE.Color(silverSettings.color);
        child.material.roughness = silverSettings.roughness;
        child.material.metalness = silverSettings.metalness;
        child.material.envMapIntensity = silverSettings.envMapIntensity;
      }
    });
  },
  (xhr) => console.log('Additional Model: ' + (xhr.loaded / xhr.total * 100) + '% loaded'),
  (error) => console.error('Error loading additional model:', error)
);

// Optimized renderer settings
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
  precision: "highp",
  premultipliedAlpha: false // Add this to fix alpha transparency
});

renderer.setClearColor(0x000000, 0); // Set clear color with 0 alpha
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8; // Increased for better visibility
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;

// Post processing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0015;
composer.addPass(rgbShiftPass);

// Optimized camera setup
camera.position.set(0, 7, 30); // Moved up on y axis

// Optimized window resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}, false);

// Optimized animation loop with mouse-based model movement
let lastTime = 0;
function animate(currentTime) {
  requestAnimationFrame(animate);
  
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  
  // Smooth mouse movement
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;
  
  // Update models based on mouse position
  if (helmetModel) {
    helmetModel.rotation.y += (targetX - helmetModel.rotation.y) * 0.05;
    helmetModel.rotation.x += (targetY - helmetModel.rotation.x) * 0.05;
  }
  
  if (swordModel) {
    swordModel.rotation.y += (targetX - swordModel.rotation.y) * 0.05;
    swordModel.rotation.x += (targetY - swordModel.rotation.x) * 0.05;
  }
  
  if (newModel) {
    newModel.rotation.y += (targetX - newModel.rotation.y) * 0.05;
    newModel.rotation.x += (targetY - newModel.rotation.x) * 0.05;
  }
  
  if (deltaTime < 160) { // Skip frame if too much time has passed
    composer.render();
  }
}

animate(0);