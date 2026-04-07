import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Icosahedron, MeshDistortMaterial, OrbitControls, Torus } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { useTheme } from '../context/useTheme'

function DarkCluster() {
  const groupRef = useRef(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.28
      groupRef.current.rotation.x += delta * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2.4} rotationIntensity={1.2} floatIntensity={1.6}>
        <Icosahedron args={[1.15, 8]}>
          <MeshDistortMaterial color="#69e2ff" emissive="#3dcbff" emissiveIntensity={0.9} roughness={0.12} metalness={0.45} distort={0.42} speed={2.2} transparent opacity={0.86} />
        </Icosahedron>
      </Float>
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.1}>
        <Torus args={[1.9, 0.06, 16, 120]} rotation={[1.2, 0.2, 0.5]}>
          <meshStandardMaterial color="#9c7cff" emissive="#9c7cff" emissiveIntensity={1} transparent opacity={0.7} />
        </Torus>
      </Float>
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.9}>
        <Torus args={[2.35, 0.035, 16, 120]} rotation={[0.8, 0.9, 0.1]}>
          <meshStandardMaterial color="#ff647c" emissive="#ff647c" emissiveIntensity={0.6} transparent opacity={0.35} />
        </Torus>
      </Float>
    </group>
  )
}

function LightCluster() {
  const groupRef = useRef(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.18
      groupRef.current.rotation.z += delta * 0.06
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.4}>
        <Torus args={[1.15, 0.3, 32, 128]} rotation={[0.9, 0.4, 0.2]}>
          <meshStandardMaterial color="#d49e54" emissive="#a05d31" emissiveIntensity={0.25} roughness={0.32} metalness={0.68} />
        </Torus>
      </Float>
      <Float speed={1.7} rotationIntensity={0.5} floatIntensity={0.9}>
        <Icosahedron args={[0.8, 5]} position={[0.2, 0.1, -0.2]}>
          <MeshDistortMaterial color="#f6d8b0" emissive="#d27a50" emissiveIntensity={0.16} roughness={0.28} metalness={0.18} distort={0.22} speed={1.5} transparent opacity={0.92} />
        </Icosahedron>
      </Float>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
        <Torus args={[1.8, 0.08, 24, 120]} rotation={[1.1, 0.2, 0.7]}>
          <meshStandardMaterial color="#3456d1" emissive="#3456d1" emissiveIntensity={0.18} transparent opacity={0.18} />
        </Torus>
      </Float>
    </group>
  )
}

function SceneContent() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const cameraPosition = useMemo(() => (isDark ? [0, 0, 5.4] : [0, 0.15, 5]), [isDark])

  return (
    <Canvas camera={{ position: cameraPosition, fov: 42 }} dpr={[1, 1.8]}>
      <ambientLight intensity={isDark ? 0.55 : 0.95} color={isDark ? '#8bdfff' : '#fff4df'} />
      <directionalLight position={[3, 3, 3]} intensity={isDark ? 1.4 : 1.2} color={isDark ? '#69e2ff' : '#ffffff'} />
      <pointLight position={[-3, -2, 2]} intensity={isDark ? 1.4 : 0.8} color={isDark ? '#9c7cff' : '#d27a50'} />
      {isDark ? <DarkCluster /> : <LightCluster />}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={isDark ? 1.6 : -1.1} />
    </Canvas>
  )
}

function SceneOrb() {
  return (
    <div className="scene-orb" aria-hidden="true">
      <SceneContent />
    </div>
  )
}

export default SceneOrb
