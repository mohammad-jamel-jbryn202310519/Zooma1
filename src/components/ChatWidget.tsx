'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const locale = useLocale();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/962780586475?text=${encodeURIComponent(input)}`;
    window.open(whatsappUrl, '_blank');
    
    setInput('');
    setIsOpen(false);
  };

  const t = {
    title: locale === 'ar' ? 'تواصل معنا' : 'Contact Us',
    subtitle: locale === 'ar' ? 'نرد عادة خلال لحظات عبر واتساب' : 'We reply instantly via WhatsApp',
    greeting: locale === 'ar' ? 'مرحباً! كيف يمكننا مساعدتك في تطوير نشاطك التجاري اليوم؟' : 'Hi! How can we help you grow your business today?',
    placeholder: locale === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message...',
    button: locale === 'ar' ? 'إرسال عبر واتساب' : 'Send via WhatsApp',
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-transform hover:scale-110 z-50 ${
          isOpen ? 'hidden' : 'block'
        }`}
        style={{ background: '#25D366', color: 'white' }}
        aria-label="Open WhatsApp chat"
      >
        <MessageCircle className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5">
          <div style={{ background: '#25D366' }} className="text-white p-4 flex justify-between items-center shadow-md z-10">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {t.title}
              </h3>
              <p className="text-xs text-white/90 mt-0.5">{t.subtitle}</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 bg-gray-50 flex flex-col gap-4 min-h-[150px]">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-200 text-sm text-gray-800 self-start max-w-[85%] leading-relaxed">
              {t.greeting}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 flex flex-col gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder={t.placeholder}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 text-gray-800 placeholder:text-gray-400"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-full py-3.5 bg-[#25D366] text-white rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
            >
              {t.button}
              <Send className="w-4 h-4 rtl:-scale-x-100" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
