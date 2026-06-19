import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText, generateId } from 'ai';
import { supabase } from '@/lib/supabase/client';

export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const referer = req.headers.get('referer') || '';
    const isEn = referer.includes('/en/') || referer.endsWith('/en');
    const locale = isEn ? 'en' : 'ar';

    const systemPrompt = `You are the AI assistant for Zooma, a digital agency in Jordan.
Your goal is to answer questions about Zooma's single subscription package and collect leads (Name, Phone, Business Type).
If the visitor's locale is 'ar' (${locale === 'ar'}), respond strictly in Arabic. If 'en', respond in English. Be polite, concise, and professional.

PACKAGE DETAILS:
Pricing: 10.5 JOD/month (0.35 JOD/day) discounted from 30 JOD/month (1 JOD/day).
Includes:
- Professional website
- 10 social media posts/month
- Google Maps listing
- Direct WhatsApp ordering
- Plastic QR stand
- Brand identity design
- Full technical support

If the user seems interested, ask for their Name, Phone number, and Business Type, then tell them you will contact them soon.`;

    const result = streamText({
      model: openrouter('meta-llama/llama-3-8b-instruct:free'),
      system: systemPrompt,
      messages,
      async onFinish({ text }) {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
        
        // Save chat log to Supabase in the background
        try {
          const sessionId = messages[0]?.id || generateId();
          const lastUserMessage = messages[messages.length - 1];
          
          await (supabase.from('chat_messages').insert as any)([
            { session_id: sessionId, role: 'user', content: lastUserMessage.content || '...' },
            { session_id: sessionId, role: 'assistant', content: text }
          ]);
        } catch (e) {
          console.error('Failed to save chat message:', e);
        }
      }
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
