'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

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
    } else {
      console.error(dbError);
      alert('An error occurred. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-100">
        <h3 className="text-xl font-bold text-green-800 mb-2">{t.success}</h3>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-2">{t.name} *</label>
          <input required type="text" id="name" name="name" className="w-full px-4 py-3 rounded-xl border border-nude-dark focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground/70 mb-2">{t.phone} *</label>
          <input required type="tel" id="phone" name="phone" className="w-full px-4 py-3 rounded-xl border border-nude-dark focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-foreground/70 mb-2">{t.business_name} *</label>
          <input required type="text" id="business_name" name="business_name" className="w-full px-4 py-3 rounded-xl border border-nude-dark focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all" />
        </div>
        <div>
          <label htmlFor="business_type" className="block text-sm font-medium text-foreground/70 mb-2">{t.business_type} *</label>
          <input required type="text" id="business_type" name="business_type" className="w-full px-4 py-3 rounded-xl border border-nude-dark focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground/70 mb-2">{t.message}</label>
        <textarea id="message" name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-nude-dark focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all resize-none"></textarea>
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-4 bg-brand text-white rounded-xl font-bold text-lg hover:bg-brand-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '...' : t.submit}
      </button>
    </form>
  );
}
