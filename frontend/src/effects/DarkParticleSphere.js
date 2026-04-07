import * as THREE from 'three'

export function initParticleSphere(container) {
  // Scene setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ alpha: true })
  
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  // Particle sphere with neon cyan particles
  const geometry = new THREE.BufferGeometry()
  const particlesCount = 3000
  const positions = new Float32Array(particlesCount * 3)
  
  for (let i = 0; i < particlesCount; i++) {
    const radius = 2
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  const material = new THREE.PointsMaterial({
    color: 0x00D4FF,
    size: 0.05,
    transparent: true,
    blending: THREE.AdditiveBlending
  })
  
  const particles = new THREE.Points(geometry, material)
  scene.add(particles)
  
  camera.position.z = 5
  
  function animate() {
    requestAnimationFrame(animate)
    particles.rotation.x += 0.002
    particles.rotation.y += 0.003
    renderer.render(scene, camera)
  }
  
  animate()
}