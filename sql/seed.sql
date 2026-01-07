-- Supabase/Postgres seed for HustleHub minimal schema

-- users (supabase has auth; this table stores profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now()
);

-- products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- gigs
CREATE TABLE IF NOT EXISTS gigs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  budget numeric(10,2),
  category text DEFAULT 'general',
  deadline date,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

-- gig applications
CREATE TABLE IF NOT EXISTS gig_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id uuid REFERENCES gigs(id) ON DELETE CASCADE,
  worker_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  proposal text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  content text,
  created_at timestamptz DEFAULT now()
);

-- transactions (wallet)
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  amount numeric(12,2) NOT NULL,
  type text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- ratings
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  target_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  gig_id uuid REFERENCES gigs(id) ON DELETE SET NULL,
  score int CHECK (score >= 1 AND score <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text,
  payload jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Example seed profile
INSERT INTO profiles (id, username, full_name, bio)
VALUES ('00000000-0000-0000-0000-000000000001','alice','Alice Example','Local designer');

-- Example product
INSERT INTO products (seller_id, title, description, price)
VALUES ('00000000-0000-0000-0000-000000000001','Handmade Mug','Stoneware mug, 12oz',25.00);

-- Example gig
INSERT INTO gigs (poster_id, title, description, budget, category)
VALUES ('00000000-0000-0000-0000-000000000001','Logo Design','Need a simple logo for a small business', 150.00, 'design');
