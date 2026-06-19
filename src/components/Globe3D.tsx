'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

function InteractiveGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const dotsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      targetRotation.current.x = scrollY * 0.001;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMouse({
          x: (e.touches[0].clientX / window.innerWidth) * 2 - 1,
          y: -(e.touches[0].clientY / window.innerHeight) * 2 + 1,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Create dots on sphere surface
  const dotsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const count = 2000;
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 2.8;
      
      positions.push(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
    }
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Create wireframe edges for continents effect
  const wireGeometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(2.75, 4);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Base rotation + mouse interaction
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.08 + mouse.x * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.1 + mouse.y * 0.2 + targetRotation.current.x;
    
    // Subtle breathing scale
    const scale = 1 + Math.sin(time * 0.5) * 0.02;
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef}>
      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Wireframe globe */}
      <lineSegments ref={wireRef} geometry={wireGeometry}>
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.2} />
      </lineSegments>
      
      {/* Dots on surface */}
      <points ref={dotsRef} geometry={dotsGeometry}>
        <pointsMaterial
          color="#ffffff"
          size={0.02}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Outer ring 1 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.25, 128]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Outer ring 2 */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <ringGeometry args={[3.4, 3.43, 128]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[3.0, 64, 64]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  );
}

export default function Globe3D() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <InteractiveGlobe />
      </Canvas>
    </div>
  );
}
