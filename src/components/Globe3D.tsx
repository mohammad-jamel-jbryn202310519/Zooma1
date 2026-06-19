'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

/* ===== FIREWORKS PARTICLE SYSTEM ===== */
function Firework({ position, onComplete }: { position: [number, number, number], onComplete: () => void }) {
  const pointsRef = useRef<THREE.Points>(null);
  const age = useRef(0);
  
  const { geometry, velocities } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 30;
    const pos = new Float32Array(count * 3);
    const vel = [];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const speed = 0.05 + Math.random() * 0.05;
      vel.push(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      );
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return { geometry: geo, velocities: vel };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    age.current += 0.02;
    
    for (let i = 0; i < 30; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];
      velocities[i * 3 + 1] -= 0.001; // Gravity
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0, 1 - age.current * 1.5);
    
    if (age.current > 1) {
      onComplete();
    }
  });

  return (
    <points ref={pointsRef} position={position} geometry={geometry}>
      <pointsMaterial color="#fcd34d" size={0.08} transparent opacity={1} sizeAttenuation />
    </points>
  );
}

/* ===== TALL REACTIVE PERSON ===== */
function TallPerson({
  mouse,
}: {
  mouse: { x: number; y: number };
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    // Eyes look at cursor smoothly
    const targetRotY = mouse.x * 0.8;
    const targetRotX = -mouse.y * 0.5;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.1;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="#e2d4f5" transparent opacity={0.95} />
      </mesh>
      
      {/* Big Eyes */}
      <mesh position={[-0.08, 0.95, 0.16]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.08, 0.95, 0.16]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Pupils tracking cursor */}
      <mesh position={[-0.08 + mouse.x * 0.03, 0.95 + mouse.y * 0.02, 0.22]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#4c1d95" />
      </mesh>
      <mesh position={[0.08 + mouse.x * 0.03, 0.95 + mouse.y * 0.02, 0.22]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#4c1d95" />
      </mesh>

      {/* Tall Body */}
      <mesh position={[0, 0.35, 0]}>
        <capsuleGeometry args={[0.12, 0.6, 16, 16]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.9} />
      </mesh>

      {/* Long Legs */}
      <mesh position={[-0.07, -0.2, 0]}>
        <capsuleGeometry args={[0.045, 0.4, 8, 8]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.07, -0.2, 0]}>
        <capsuleGeometry args={[0.045, 0.4, 8, 8]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/* ===== SINGLE JUMPING PERSON ===== */
function JumpingPerson({ 
  basePosition, 
  mouse, 
  isClicking, 
  addFirework,
  facingAngle,
}: { 
  basePosition: [number, number, number];
  mouse: { x: number; y: number }; 
  isClicking: boolean; 
  addFirework: (x: number, y: number) => void;
  facingAngle: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const jumpOffset = useRef(0);
  const jumpSpeed = useRef(0);
  const isJumping = useRef(false);
  const targetRot = useRef(facingAngle);
  const currentRot = useRef(facingAngle);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Jump physics
    if (isClicking && !isJumping.current) {
      isJumping.current = true;
      jumpSpeed.current = 0.12; // Short jump
      targetRot.current += Math.PI * 2; // Spin one full circle
      
      // Firework right above the person
      addFirework(basePosition[0], basePosition[1] + 1.5);
    }
    
    if (isJumping.current) {
      jumpOffset.current += jumpSpeed.current;
      jumpSpeed.current -= 0.015; // Gravity
      if (jumpOffset.current <= 0) {
        jumpOffset.current = 0;
        isJumping.current = false;
        jumpSpeed.current = 0;
      }
    }

    // Smoothly apply spin
    currentRot.current += (targetRot.current - currentRot.current) * 0.1;
    groupRef.current.rotation.y = currentRot.current;

    // Small idle bobbing to look alive
    const time = state.clock.elapsedTime;
    const bob = Math.sin(time * 3 + basePosition[0]) * 0.05;
    
    // Position
    groupRef.current.position.set(basePosition[0], basePosition[1] + bob + Math.max(0, jumpOffset.current), basePosition[2]);
  });

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      <TallPerson mouse={mouse} />
    </group>
  );
}

/* ===== GLOBE ===== */
function InteractiveGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const targetRotation = useRef({ x: 0 });
  const [fireworks, setFireworks] = useState<{id: number, x: number, y: number}[]>([]);

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

  const removeFirework = (id: number) => {
    setFireworks(prev => prev.filter(f => f.id !== id));
  };

  const addFirework = (x: number, y: number) => {
    setFireworks(prev => [...prev, { id: Date.now() + Math.random(), x, y }]);
  };

  // Adjust X position based on screen width so they are always visible
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const personXOffset = isMobile ? 1.0 : 1.6;
  const personYOffset = isMobile ? -1.2 : -1.0;

  return (
    <>
      {/* Central Globe */}
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

      {/* Left Person */}
      <JumpingPerson 
        basePosition={[-personXOffset, personYOffset, 1.0]} 
        mouse={mouse} 
        isClicking={isClicking} 
        addFirework={addFirework} 
        facingAngle={0.3}
      />

      {/* Right Person */}
      <JumpingPerson 
        basePosition={[personXOffset, personYOffset, 1.0]} 
        mouse={mouse} 
        isClicking={isClicking} 
        addFirework={addFirework} 
        facingAngle={-0.3}
      />

      {/* Render Fireworks */}
      {fireworks.map(fw => (
        <Firework key={fw.id} position={[fw.x, fw.y, 1.5]} onComplete={() => removeFirework(fw.id)} />
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
      <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.5} />
        <InteractiveGlobe />
      </Canvas>
    </div>
  );
}
