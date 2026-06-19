'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

/* ===== REACTIVE PERSON ===== */
function Person({
  position,
  mouse,
  isClicking,
  index,
}: {
  position: [number, number, number];
  mouse: { x: number; y: number };
  isClicking: boolean;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const jumpOffset = useRef(0);
  const jumpPhase = useRef(Math.random() * Math.PI * 2);
  const jumpSpeed = useRef(0);
  const isJumping = useRef(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Smooth look toward mouse
    const targetRotY = mouse.x * 0.6;
    const targetRotX = -mouse.y * 0.4;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.08;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.08;

    // Jumping when clicked
    if (isClicking && !isJumping.current) {
      isJumping.current = true;
      jumpSpeed.current = 0.18 + index * 0.04;
    }
    if (isJumping.current) {
      jumpOffset.current += jumpSpeed.current;
      jumpSpeed.current -= 0.01;
      if (jumpOffset.current <= 0) {
        jumpOffset.current = 0;
        isJumping.current = false;
        jumpSpeed.current = 0;
      }
    }

    // Idle bobbing
    const bob = Math.sin(time * 1.5 + jumpPhase.current) * 0.05;
    groupRef.current.position.y = position[1] + bob + Math.max(0, jumpOffset.current);
  });

  // Arm angles driven by mouse
  const armLAngle = -0.5 - mouse.y * 0.3;
  const armRAngle = -0.5 - mouse.y * 0.3;

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {/* Head */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color="#e2d4f5" transparent opacity={0.9} />
      </mesh>
      {/* Eye whites */}
      <mesh position={[-0.045, 0.41, 0.1]}>
        <sphereGeometry args={[0.032, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.045, 0.41, 0.1]}>
        <sphereGeometry args={[0.032, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Pupils that track cursor */}
      <mesh position={[-0.045 + mouse.x * 0.015, 0.41 + mouse.y * 0.01, 0.118]}>
        <sphereGeometry args={[0.016, 8, 8]} />
        <meshBasicMaterial color="#4c1d95" />
      </mesh>
      <mesh position={[0.045 + mouse.x * 0.015, 0.41 + mouse.y * 0.01, 0.118]}>
        <sphereGeometry args={[0.016, 8, 8]} />
        <meshBasicMaterial color="#4c1d95" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.07, 0.22, 8, 8]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.85} />
      </mesh>
      {/* Left arm — points toward cursor */}
      <group position={[-0.12, 0.22, 0]} rotation={[0, 0, 0.8 + mouse.y * 0.4]}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.025, 0.14, 4, 6]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.8} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#e2d4f5" transparent opacity={0.85} />
        </mesh>
      </group>
      {/* Right arm */}
      <group position={[0.12, 0.22, 0]} rotation={[0, 0, -0.8 - mouse.y * 0.4]}>
        <mesh position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.025, 0.14, 4, 6]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#e2d4f5" transparent opacity={0.85} />
        </mesh>
      </group>
      {/* Legs */}
      <mesh position={[-0.05, -0.2, 0]}>
        <capsuleGeometry args={[0.025, 0.14, 4, 6]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.05, -0.2, 0]}>
        <capsuleGeometry args={[0.025, 0.14, 4, 6]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/* ===== GLOBE ===== */
function InteractiveGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const targetRotation = useRef({ x: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 });
    };
    const onScroll = () => { targetRotation.current.x = window.scrollY * 0.001; };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMouse({ x: (e.touches[0].clientX / window.innerWidth) * 2 - 1, y: -(e.touches[0].clientY / window.innerHeight) * 2 + 1 });
      }
    };
    const onDown = () => { setIsClicking(true); setTimeout(() => setIsClicking(false), 300); };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('touchstart', onDown);
    };
  }, []);

  const dotsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos: number[] = [];
    for (let i = 0; i < 1000; i++) {
      const phi = Math.acos(-1 + (2 * i) / 1000);
      const theta = Math.sqrt(1000 * Math.PI) * phi;
      const r = 1.2;
      pos.push(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    return geo;
  }, []);

  const wireGeo = useMemo(() => new THREE.IcosahedronGeometry(1.15, 3), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.1 + mouse.x * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.1 + mouse.y * 0.15 + targetRotation.current.x;
  });

  // 4 people at corners around the globe
  const people: [number, number, number][] = [
    [-2.0, -0.5, 0.5],
    [2.0, -0.5, 0.5],
    [-1.6, 0.8, 0.3],
    [1.6, 0.8, 0.3],
  ];

  return (
    <>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[1.0, 48, 48]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.1} />
        </mesh>
        <lineSegments geometry={wireGeo}>
          <lineBasicMaterial color="#a78bfa" transparent opacity={0.15} />
        </lineSegments>
        <points geometry={dotsGeo}>
          <pointsMaterial color="#ffffff" size={0.012} transparent opacity={0.5} sizeAttenuation />
        </points>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.35, 1.37, 80]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {people.map((pos, i) => (
        <Person key={i} position={pos} mouse={mouse} isClicking={isClicking} index={i} />
      ))}
    </>
  );
}

export default function Globe3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.5} />
        <InteractiveGlobe />
      </Canvas>
    </div>
  );
}
