'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, Building2, MessageCircle, ArrowRight, ChevronDown, Store } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface PackageData {
  type: 'stores' | 'companies';
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  title: string;
  originalPrice: string;
  discountPrice: string;
  discountNote: string;
  validityNote: string;
  features: string[];
  ctaLabel: string;
  ctaHref?: string;
  ctaWhatsapp?: string;
  accentColor: string;
  glowColor: string;
}

interface PackageCardsProps {
  storesData: PackageData;
  companiesData: PackageData;
}

function PackageCard({ data, defaultOpen = false }: { data: PackageData; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${data.accentColor}40`,
        boxShadow: isOpen ? `0 20px 60px ${data.glowColor}` : '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${data.accentColor}, ${data.accentColor}88)` }} />

      {/* Header — always visible, click to toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 text-start"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${data.accentColor}25`, border: `1px solid ${data.accentColor}40` }}>
            {data.icon}
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: data.accentColor }}>{data.badge}</p>
            <h3 className="text-base md:text-xl font-black text-white leading-tight">{data.title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-end">
            <p className="text-[10px] text-white/40 line-through">{data.originalPrice}</p>
            <p className="text-lg md:text-2xl font-black text-white">{data.discountPrice}</p>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-white/60"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </button>

      {/* Expandable details */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 md:px-5 md:pb-6">
              {/* Price block */}
              <div className="text-center py-4 mb-4 rounded-xl" style={{ background: `${data.accentColor}15` }}>
                <p className="text-white/50 text-xs mb-1">{data.discountNote}</p>
                <div className="inline-block bg-red-500/80 px-3 py-0.5 rounded-full text-white font-bold text-[10px] badge-pulse">
                  🔥 {data.validityNote}
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-2 mb-5">
                {data.features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                      style={{ background: `${data.accentColor}30` }}>
                      <CheckCircle2 className="w-3 h-3" style={{ color: data.accentColor }} />
                    </div>
                    <span className="text-white/80 text-xs md:text-sm leading-snug font-medium">{f}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              {data.ctaWhatsapp ? (
                <a
                  href={data.ctaWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: '#22c55e', boxShadow: '0 8px 24px rgba(34,197,94,0.3)' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  {data.ctaLabel}
                </a>
              ) : (
                <Link
                  href={data.ctaHref as any}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: data.accentColor, color: '#fff', boxShadow: `0 8px 24px ${data.glowColor}` }}
                >
                  {data.ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PackageCards({ storesData, companiesData }: PackageCardsProps) {
  return (
    <div className="flex flex-col gap-4">
      <PackageCard data={storesData} defaultOpen={true} />
      <PackageCard data={companiesData} defaultOpen={false} />
    </div>
  );
}
