import * as THREE from 'three'

export function initGoldRings(container) {
  // Similar structure but with gold torus knots
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ alpha: true })
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)
  
  // Create gold torus knot
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
  const material = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x442200
  })
  
  const knot = new THREE.Mesh(geometry, material)
  scene.add(knot)
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)
  
  camera.position.z = 3
  
  function animate() {
    requestAnimationFrame(animate)
    knot.rotation.x += 0.01
    knot.rotation.y += 0.02
    renderer.render(scene, camera)
  }
  
  animate()
}