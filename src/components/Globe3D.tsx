'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

/* ===== SMALL PERSON THAT LOOKS AT CURSOR ===== */
function Person({ position, mouse }: { position: [number, number, number]; mouse: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    // Make person look toward cursor
    const targetX = mouse.x * 0.4;
    const targetY = mouse.y * 0.3;
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.025, 0.24, 0.065]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#7c3aed" />
      </mesh>
      <mesh position={[0.025, 0.24, 0.065]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#7c3aed" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.05, 0]}>
        <capsuleGeometry args={[0.04, 0.12, 8, 8]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.7} />
      </mesh>
      {/* Arms - pointing toward cursor */}
      <mesh position={[-0.08, 0.1, 0.03]} rotation={[0, 0, 0.6]}>
        <capsuleGeometry args={[0.015, 0.08, 4, 4]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.08, 0.1, 0.03]} rotation={[0, 0, -0.6]}>
        <capsuleGeometry args={[0.015, 0.08, 4, 4]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/* ===== INTERACTIVE GLOBE ===== */
function InteractiveGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    const handleScroll = () => {
      targetRotation.current.x = window.scrollY * 0.001;
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

  const dotsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const count = 1200;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 1.4;
      positions.push(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  const wireGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.35, 3), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = time * 0.1 + mouse.x * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.1 + mouse.y * 0.15 + targetRotation.current.x;
    const s = 1 + Math.sin(time * 0.5) * 0.015;
    groupRef.current.scale.set(s, s, s);
  });

  // People positions around the globe
  const people: [number, number, number][] = [
    [-2.2, -0.8, 0],
    [2.2, -0.6, 0],
    [-1.8, 1.0, 0.3],
    [1.9, 0.9, 0.2],
    [0, -1.5, 0.5],
  ];

  return (
    <>
      <group ref={groupRef}>
        {/* Globe sphere */}
        <mesh>
          <sphereGeometry args={[1.2, 48, 48]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.12} />
        </mesh>
        {/* Wireframe */}
        <lineSegments geometry={wireGeometry}>
          <lineBasicMaterial color="#a78bfa" transparent opacity={0.15} />
        </lineSegments>
        {/* Dots */}
        <points geometry={dotsGeometry}>
          <pointsMaterial color="#ffffff" size={0.015} transparent opacity={0.5} sizeAttenuation />
        </points>
        {/* Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.6, 1.63, 96]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
        {/* Atmosphere */}
        <mesh>
          <sphereGeometry args={[1.5, 48, 48]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.04} />
        </mesh>
      </group>

      {/* People around the globe */}
      {people.map((pos, i) => (
        <Person key={i} position={pos} mouse={mouse} />
      ))}
    </>
  );
}

export default function Globe3D() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 40 }}
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
