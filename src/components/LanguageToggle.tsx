'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export default function LanguageToggle({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = currentLocale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <motion.button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full glass text-white/90 hover:text-white hover:bg-white/15 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Globe className="w-3.5 h-3.5" />
      {currentLocale === 'ar' ? 'EN' : 'عربي'}
    </motion.button>
  );
}
