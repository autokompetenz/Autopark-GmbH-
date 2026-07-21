-- Autopark GmbH — Supabase Schema (with Auth)
-- Run this ENTIRE script in Supabase SQL Editor

-- Clean start
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at();
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP TABLE IF EXISTS order_tracking CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ── PROFILES (extends auth.users) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT UNIQUE NOT NULL,
  username      TEXT UNIQUE NOT NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  phone         TEXT,
  address       TEXT,
  monthly_salary NUMERIC,
  role          TEXT DEFAULT 'CLIENT' CHECK (role IN ('CLIENT','ADMIN')),
  email_verified BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;
CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Helper: check admin without recursion
CREATE OR REPLACE FUNCTION is_admin(uid UUID) RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = uid AND role = 'ADMIN');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── CARS ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cars (
  id              SERIAL PRIMARY KEY,
  make            TEXT NOT NULL,
  model           TEXT NOT NULL,
  year            INT NOT NULL,
  price           NUMERIC NOT NULL,
  stock           INT DEFAULT 1,
  description     TEXT,
  fuel_type       TEXT NOT NULL,
  transmission    TEXT NOT NULL,
  mileage         INT DEFAULT 0,
  color           TEXT,
  power           INT,
  category        TEXT NOT NULL,
  image_url       TEXT,
  image_url_2     TEXT,
  image_url_3     TEXT,
  image_url_4     TEXT,
  image_url_5     TEXT,
  image_url_6     TEXT,
  image_url_7     TEXT,
  image_url_8     TEXT,
  image_url_9     TEXT,
  image_url_10    TEXT,
  image_url_11    TEXT,
  image_url_12    TEXT,
  image_url_13    TEXT,
  image_url_14    TEXT,
  image_url_15    TEXT,
  image_url_16    TEXT,
  image_url_17    TEXT,
  image_url_18    TEXT,
  image_url_19    TEXT,
  image_url_20    TEXT,
  min_salary      NUMERIC,
  monthly_payment NUMERIC,
  featured        BOOLEAN DEFAULT false,
  promotional     BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  camping_car     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_cars_updated ON cars;
CREATE TRIGGER trg_cars_updated
  BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── ORDERS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                SERIAL PRIMARY KEY,
  order_number      TEXT UNIQUE NOT NULL,
  user_id           UUID NOT NULL REFERENCES profiles(id),
  total_price       NUMERIC NOT NULL,
  payment_type      TEXT NOT NULL CHECK (payment_type IN ('full','deposit','monthly')),
  deposit_amount    NUMERIC,
  monthly_amount    NUMERIC,
  monthly_duration  INT,
  discount_amount   NUMERIC,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
  notes             TEXT,
  shipping_address  TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_orders_updated ON orders;
CREATE TRIGGER trg_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── ORDER ITEMS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  car_id     INT NOT NULL REFERENCES cars(id),
  quantity   INT DEFAULT 1,
  unit_price NUMERIC NOT NULL
);

-- ── ORDER TRACKING ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_tracking (
  id         SERIAL PRIMARY KEY,
  order_id   INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status     TEXT NOT NULL,
  comment    TEXT,
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CART ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart (
  id           SERIAL PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  car_id       INT NOT NULL REFERENCES cars(id),
  quantity     INT DEFAULT 1,
  payment_type TEXT DEFAULT 'full' CHECK (payment_type IN ('full','deposit','monthly')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

-- ── STORAGE BUCKET ───────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('cars', 'cars', true)
ON CONFLICT (id) DO NOTHING;

-- ── RLS POLICIES ─────────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
-- Admin: uses SECURITY DEFINER function (no recursion)
CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT USING (is_admin(auth.uid()));

-- Cars: everyone reads, admins do everything
CREATE POLICY "cars_select_public" ON cars FOR SELECT USING (true);
CREATE POLICY "cars_insert_admin" ON cars FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "cars_update_admin" ON cars FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "cars_delete_admin" ON cars FOR DELETE USING (is_admin(auth.uid()));

-- Orders: users see their own, admins see all
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_select_admin" ON orders FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_admin" ON orders FOR UPDATE USING (is_admin(auth.uid()));

-- Order items: via order ownership
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (user_id = auth.uid() OR is_admin(auth.uid())))
);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);

-- Order tracking: via order ownership
CREATE POLICY "order_tracking_select" ON order_tracking FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (user_id = auth.uid() OR is_admin(auth.uid())))
);
CREATE POLICY "order_tracking_insert" ON order_tracking FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- Cart: own only
CREATE POLICY "cart_select_own" ON cart FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cart_insert_own" ON cart FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_update_own" ON cart FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cart_delete_own" ON cart FOR DELETE USING (auth.uid() = user_id);

-- Storage: public read, authenticated write
CREATE POLICY "cars_storage_public" ON storage.objects FOR SELECT USING (bucket_id = 'cars');
CREATE POLICY "cars_storage_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cars' AND auth.role() = 'authenticated');
CREATE POLICY "cars_storage_delete" ON storage.objects FOR DELETE USING (bucket_id = 'cars' AND auth.role() = 'authenticated');
