'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const locale = useLocale();
  
  const { messages, sendMessage, status } = useChat();
  
  const isLoading = status === 'streaming' || status === 'submitted';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const t = {
    title: locale === 'ar' ? 'مساعد زوما' : 'Zooma Assistant',
    subtitle: locale === 'ar' ? 'نرد عادة خلال لحظات' : 'We usually reply instantly',
    greeting: locale === 'ar' ? 'مرحباً! كيف يمكننا مساعدتك في تطوير متجرك اليوم؟' : 'Hi! How can we help you grow your business today?',
    placeholder: locale === 'ar' ? 'اكتب رسالتك...' : 'Type your message...',
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-brand text-white rounded-full shadow-2xl transition-transform hover:scale-110 z-50 ${
          isOpen ? 'hidden' : 'block'
        }`}
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-beige overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-brand text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">{t.title}</h3>
              <p className="text-xs text-white/80">{t.subtitle}</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-white/70 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-nude/30 flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="text-center text-foreground/50 mt-10">
                <p className="text-sm">{t.greeting}</p>
              </div>
            )}
            
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user'
                    ? 'bg-brand text-white self-end rounded-tr-none'
                    : 'bg-white border border-beige text-foreground self-start rounded-tl-none shadow-sm'
                }`}
              >
                {m.parts?.map((part: any, i: number) => (
                  <span key={i}>
                    {part.type === 'text' ? part.text : null}
                  </span>
                ))}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border border-beige text-foreground/50 self-start p-3 rounded-2xl rounded-tl-none text-sm shadow-sm">
                ...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-nude-dark flex items-center gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder={t.placeholder}
              className="flex-1 bg-nude rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-brand text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
