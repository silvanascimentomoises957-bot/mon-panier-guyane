-- ============================================================
-- Mon Panier Guyane — Schéma Supabase
-- Coller ce SQL dans: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. TABLE PRODUCTS
create table public.products (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  name            text not null,
  description     text not null default '',
  short_description text not null default '',
  price           numeric(10,2) not null,
  stock           int not null default 0,
  category        text not null default 'mix'
                  check (category in ('fruits','legumes','mix','bio','solo','smoothie')),
  image_url       text,
  emoji           text not null default '🧺',
  is_promo        boolean not null default false,
  tags            text[] not null default '{}',
  is_active       boolean not null default true
);

-- 2. TABLE PROFILES (extends auth.users)
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  created_at      timestamptz default now(),
  full_name       text not null default '',
  email           text not null default '',
  phone           text,
  loyalty_points  int not null default 0,
  loyalty_level   text not null default 'bronze'
                  check (loyalty_level in ('bronze','silver','or','platine')),
  addresses       jsonb not null default '[]',
  is_admin        boolean not null default false
);

-- 3. TABLE ORDERS
create table public.orders (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  client_id       uuid references auth.users(id) on delete set null,
  status          text not null default 'attente'
                  check (status in ('attente','preparation','route','livre')),
  delivery_type   text not null default 'livraison'
                  check (delivery_type in ('livraison','retrait')),
  delivery_address text,
  store_location  text,
  payment_method  text not null default 'carte'
                  check (payment_method in ('carte','mobile','livraison')),
  payment_status  text not null default 'pending'
                  check (payment_status in ('pending','paid','failed')),
  total           numeric(10,2) not null,
  items           jsonb not null default '[]',
  notes           text
);

-- 4. STORAGE BUCKET for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

-- 5. ROW LEVEL SECURITY (RLS)
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders   enable row level security;

-- Products: everyone can read, only admins write
create policy "products_read_all"   on public.products for select using (true);
create policy "products_admin_write" on public.products for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Profiles: users see only their own
create policy "profiles_own" on public.profiles for all using (id = auth.uid());

-- Orders: users see own orders, admins see all
create policy "orders_own_read" on public.orders for select
  using (client_id = auth.uid() or
         exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "orders_insert"   on public.orders for insert with check (client_id = auth.uid());
create policy "orders_admin_update" on public.orders for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Storage policies
create policy "images_public_read" on storage.objects for select
  using (bucket_id = 'product-images');
create policy "images_admin_upload" on storage.objects for insert
  with check (bucket_id = 'product-images' and
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 6. AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7. AUTO-UPDATE LOYALTY POINTS ON ORDER
create or replace function public.handle_new_order()
returns trigger language plpgsql security definer as $$
declare
  points_earned int := floor(new.total)::int;
  new_points int;
begin
  update public.profiles
  set loyalty_points = loyalty_points + points_earned,
      loyalty_level = case
        when loyalty_points + points_earned >= 1000 then 'platine'
        when loyalty_points + points_earned >= 500  then 'or'
        when loyalty_points + points_earned >= 200  then 'silver'
        else 'bronze'
      end
  where id = new.client_id
  returning loyalty_points into new_points;
  return new;
end;
$$;

create trigger on_order_inserted
  after insert on public.orders
  for each row execute function public.handle_new_order();

-- 8. SAMPLE DATA (optional — supprimer si non désiré)
insert into public.products (name, description, short_description, price, stock, category, emoji, is_promo, tags) values
  ('Panier Tropical',        'Un panier généreux de fruits tropicaux frais, cueillis le matin même.',  'Fruits tropicaux · 5 kg',  18.90, 12, 'fruits',   '🧺', false, ARRAY['Fruits','Local','Frais']),
  ('Panier Légumes',         'Sélection de légumes frais du marché de Cayenne.',                        'Légumes du marché · 4 kg', 15.50,  8, 'legumes',  '🧺', true,  ARRAY['Légumes','Local','Bio']),
  ('Panier Famille',         'Le grand panier famille pour toute la semaine.',                          'Mix fruits & légumes · 8 kg', 28.00, 5, 'mix',    '🧺', false, ARRAY['Mix','Local','Famille']),
  ('Panier Découverte',      'Une sélection de saison choisie par notre équipe.',                       'Sélection surprise · 3 kg', 12.00, 10, 'mix',    '🧺', false, ARRAY['Surprise','Local','Frais']),
  ('Panier Bio',             'Entièrement bio et local, cultivé sans pesticides.',                       '100% Bio · 5 kg',         24.00,  6, 'bio',     '🧺', false, ARRAY['Bio','Local','Premium']),
  ('Panier Fruits Exotiques','Carambole, corossol, papaye, goyave, maracuja.',                          'Exotiques · 4 kg',        22.00,  9, 'fruits',  '🧺', true,  ARRAY['Exotique','Fruits','Premium']),
  ('Panier Solo',            'Le panier idéal pour une ou deux personnes.',                             'Pour 1-2 personnes · 2 kg', 9.90, 15, 'solo',   '🧺', false, ARRAY['Solo','Frais','Local']),
  ('Panier Smoothie',        'Spécialement composé pour vos smoothies et jus frais.',                   'Fruits à mixer · 3 kg',   14.50,  7, 'smoothie','🧺', false, ARRAY['Smoothie','Fruits','Frais']);
