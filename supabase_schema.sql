-- Supabase SQL Schema for Zooma

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Services Table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Packages Table
CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'JOD',
    features TEXT[] NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Portfolio Items Table
CREATE TABLE public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    image_url TEXT,
    link_url TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Testimonials Table
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    business_name TEXT,
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Leads Table (Contact Form Submissions)
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    business_name TEXT,
    business_type TEXT,
    message TEXT,
    source TEXT DEFAULT 'website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Chat Messages Table
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Content Tables: Public Read Access (Anon and Authenticated)
CREATE POLICY "Allow public read-only access for services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for portfolio_items" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for testimonials" ON public.testimonials FOR SELECT USING (true);

-- Leads Table: Public Insert Only (No public read/update/delete)
CREATE POLICY "Allow public insert for leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Chat Messages Table: Public Insert Only (Allow tracking conversations temporarily, usually handled server-side though)
CREATE POLICY "Allow public insert for chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
-- Optionally allow selecting own session messages if needed for client-side chat history
CREATE POLICY "Allow reading chat messages by session" ON public.chat_messages FOR SELECT USING (true);

-- Note: In a real production setup, you would add policies for authenticated admins to manage this data.
