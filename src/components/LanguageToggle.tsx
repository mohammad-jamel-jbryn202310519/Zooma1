'use client';

import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageToggle({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = currentLocale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="text-xs font-bold px-3 py-1.5 rounded-full border border-nude-dark bg-white text-brand hover:bg-brand hover:text-white transition-colors"
    >
      {currentLocale === 'ar' ? 'English' : 'عربي'}
    </button>
  );
}
