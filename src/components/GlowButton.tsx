'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  size?: 'md' | 'lg' | 'xl';
}

export default function GlowButton({ children, href, onClick, variant = 'primary', className = '', size = 'lg' }: GlowButtonProps) {
  const sizes = {
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-12 py-5 text-2xl',
  };

  const variants = {
    primary: 'bg-white text-[#7c3aed] font-black',
    secondary: 'bg-transparent border-2 border-white/40 text-white font-bold',
  };

  const content = (
    <motion.span
      className={`relative inline-flex items-center justify-center gap-2 rounded-full overflow-hidden ${sizes[size]} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      style={{
        boxShadow: variant === 'primary'
          ? '0 0 20px rgba(255,255,255,0.3), 0 0 60px rgba(141,65,247,0.2), 0 10px 40px rgba(0,0,0,0.1)'
          : '0 0 20px rgba(255,255,255,0.1)',
      }}
    >
      {/* Animated shine */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
        style={{ width: '50%' }}
      />
      <span className="relative z-10">{children}</span>
    </motion.span>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return <button onClick={onClick}>{content}</button>;
}
