-- Zooma Database Schema (Bilingual)
-- Execute this file in the Supabase SQL Editor

-- 1. package_features
create table if not exists public.package_features (
    id uuid default gen_random_uuid() primary key,
    title_ar text not null,
    title_en text not null,
    description_ar text not null,
    description_en text not null,
    icon text,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. portfolio_items
create table if not exists public.portfolio_items (
    id uuid default gen_random_uuid() primary key,
    client_name text not null,
    business_type text not null,
    image_url text,
    link_url text,
    description_ar text,
    description_en text,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. testimonials
create table if not exists public.testimonials (
    id uuid default gen_random_uuid() primary key,
    client_name text not null,
    business_name text,
    quote_ar text not null,
    quote_en text not null,
    rating integer check (rating >= 1 and rating <= 5) default 5,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. leads
create table if not exists public.leads (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    phone text not null,
    email text,
    business_name text,
    business_type text,
    message text,
    source text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. chat_messages
create table if not exists public.chat_messages (
    id uuid default gen_random_uuid() primary key,
    session_id text not null,
    role text not null check (role in ('system', 'user', 'assistant')),
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.package_features enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.leads enable row level security;
alter table public.chat_messages enable row level security;

-- package_features: Public Read-Only
create policy "Allow public read access to package_features"
on public.package_features for select
to public
using (true);

-- portfolio_items: Public Read-Only
create policy "Allow public read access to portfolio_items"
on public.portfolio_items for select
to public
using (true);

-- testimonials: Public Read-Only
create policy "Allow public read access to testimonials"
on public.testimonials for select
to public
using (true);

-- leads: Public Insert-Only
create policy "Allow public insert to leads"
on public.leads for insert
to public
with check (true);

-- chat_messages: Public Insert and Read (for session context)
-- We only allow reading messages if they have the session_id, but here we just allow insert
create policy "Allow public insert to chat_messages"
on public.chat_messages for insert
to public
with check (true);

create policy "Allow public read chat_messages"
on public.chat_messages for select
to public
using (true);
