'use client'
import { useRef, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* Decorative torus knot — evokes traditional Korean 매듭 (maedeum / decorative knot) */
function KnotMesh({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const mx = mouseRef.current?.x ?? 0
    const my = mouseRef.current?.y ?? 0
    // Slow continuous spin + subtle mouse-driven tilt
    meshRef.current.rotation.x = t * 0.08 + my * 0.18
    meshRef.current.rotation.y = t * 0.12 + mx * 0.18
  })

  return (
    <mesh ref={meshRef} castShadow>
      {/* p=2, q=3 gives an elegant 2-lobed knot */}
      <torusKnotGeometry args={[1, 0.26, 160, 20, 2, 3]} />
      <meshStandardMaterial
        color="#C4A882"
        roughness={0.45}
        metalness={0.08}
        envMapIntensity={0.4}
      />
    </mesh>
  )
}

function FloatingParticles() {
  const points = useRef<THREE.Points>(null)
  const count = 60

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 8
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4
  }

  useFrame(({ clock }) => {
    if (!points.current) return
    points.current.rotation.y = clock.getElapsedTime() * 0.02
    points.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.1
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#C4A882" size={0.025} transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

interface Props {
  mouseRef: React.RefObject<{ x: number; y: number }>
}

export default function HaeulScene({ mouseRef }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.7} color="#FDF6ED" />
      <directionalLight position={[4, 5, 4]} intensity={1.4} color="#FDFBF7" />
      <directionalLight position={[-4, -2, -3]} intensity={0.25} color="#C4A882" />
      <KnotMesh mouseRef={mouseRef} />
      <FloatingParticles />
    </Canvas>
  )
}
