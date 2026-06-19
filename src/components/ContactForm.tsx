'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactFormProps {
  translations: {
    name: string;
    phone: string;
    business_name: string;
    business_type: string;
    message: string;
    submit: string;
    success: string;
  }
}

export default function ContactForm({ translations: t }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || null,
      business_name: formData.get('business_name') as string,
      business_type: formData.get('business_type') as string,
      message: formData.get('message') as string,
      source: 'website',
    };

    // @ts-expect-error - bypassing Supabase strict type inference
    const { error: dbError } = await supabase.from('leads').insert([data]);

    setIsSubmitting(false);

    if (!dbError) {
      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();

      // Redirect to WhatsApp
      const whatsappMessage = `مرحباً، أود الاشتراك في باقاتكم.
الاسم: ${data.name}
رقم الهاتف: ${data.phone}
اسم النشاط: ${data.business_name}
نوع النشاط: ${data.business_type}
الرسالة: ${data.message}`;
      
      const whatsappUrl = `https://wa.me/962780586475?text=${encodeURIComponent(whatsappMessage)}`;
      window.location.href = whatsappUrl;

    } else {
      console.error(dbError);
      alert('An error occurred. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">{t.success}</h3>
      </motion.div>
    );
  }

  const inputClasses = "w-full px-3.5 py-3 md:px-5 md:py-4 bg-white/10 text-white text-sm md:text-base rounded-xl border border-white/15 focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none transition-all placeholder:text-white/30 hover:bg-white/15 focus:bg-white/15";
  const labelClasses = "block text-xs md:text-sm font-semibold text-white/80 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
      <div className="grid md:grid-cols-2 gap-3 md:gap-5">
        <div>
          <label htmlFor="name" className={labelClasses}>{t.name} *</label>
          <input required type="text" id="name" name="name" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClasses}>{t.phone} *</label>
          <input required type="tel" id="phone" name="phone" className={inputClasses} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3 md:gap-5">
        <div>
          <label htmlFor="business_name" className={labelClasses}>{t.business_name} *</label>
          <input required type="text" id="business_name" name="business_name" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="business_type" className={labelClasses}>{t.business_type} *</label>
          <input required type="text" id="business_type" name="business_type" className={inputClasses} />
        </div>
      </div>
      <div>
        <label htmlFor="message" className={labelClasses}>{t.message}</label>
        <textarea id="message" name="message" rows={4} className={`${inputClasses} resize-none`}></textarea>
      </div>
      <motion.button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-3.5 md:py-5 bg-white text-[#7c3aed] rounded-xl font-bold text-sm md:text-lg shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-glow"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Send className="w-5 h-5" />
        {isSubmitting ? '...' : t.submit}
      </motion.button>
    </form>
  );
}
