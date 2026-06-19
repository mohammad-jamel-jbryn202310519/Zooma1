'use client';

import { motion } from 'framer-motion';

const orbs = [
  { size: 300, x: '10%', y: '20%', delay: 0, duration: 20, color: 'rgba(167, 139, 250, 0.3)' },
  { size: 250, x: '70%', y: '10%', delay: 2, duration: 25, color: 'rgba(196, 181, 253, 0.2)' },
  { size: 400, x: '80%', y: '60%', delay: 4, duration: 22, color: 'rgba(139, 92, 246, 0.25)' },
  { size: 200, x: '20%', y: '70%', delay: 1, duration: 18, color: 'rgba(221, 214, 254, 0.2)' },
  { size: 350, x: '50%', y: '40%', delay: 3, duration: 30, color: 'rgba(109, 40, 217, 0.2)' },
];

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 30, -20, 20, 0],
            y: [0, -50, 20, 40, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
