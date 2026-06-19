'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface MobileMenuProps {
  links: { href: string; label: string }[];
  ctaLink: { href: string; label: string };
}

export default function MobileMenu({ links, ctaLink }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white/90 hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 glass-strong overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-4">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href as any}
                    className="text-white/90 hover:text-white font-medium text-lg transition-colors block py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.1 }}
              >
                <Link
                  href={ctaLink.href as any}
                  className="inline-block bg-white text-[#7c3aed] px-6 py-3 rounded-full font-bold text-base text-center w-full hover:bg-gray-100 transition-colors shadow-lg mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  {ctaLink.label}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
