-- Movies table
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  genre TEXT[] NOT NULL,
  rating TEXT NOT NULL,
  poster_url TEXT,
  backdrop_url TEXT,
  release_date DATE,
  director TEXT,
  starring TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theaters table
CREATE TABLE theaters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  screen_type TEXT NOT NULL DEFAULT 'standard',
  total_rows INTEGER NOT NULL,
  seats_per_row INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Showtimes table
CREATE TABLE showtimes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  theater_id UUID REFERENCES theaters(id) ON DELETE CASCADE,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  price_regular DECIMAL(10,2) NOT NULL DEFAULT 12.00,
  price_premium DECIMAL(10,2) NOT NULL DEFAULT 18.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seats table (individual seat status for each showtime)
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  showtime_id UUID REFERENCES showtimes(id) ON DELETE CASCADE,
  row_number INTEGER NOT NULL,
  seat_number INTEGER NOT NULL,
  seat_label TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'selected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(showtime_id, row_number, seat_number)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  showtime_id UUID REFERENCES showtimes(id) ON DELETE CASCADE,
  seats UUID[] NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  booking_reference TEXT UNIQUE NOT NULL DEFAULT 'BK' || to_char(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('booking_seq')::TEXT, 6, '0'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE showtimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for movies (public read)
CREATE POLICY "movies_read_all" ON movies FOR SELECT TO public USING (true);

-- RLS Policies for theaters (public read)
CREATE POLICY "theaters_read_all" ON theaters FOR SELECT TO public USING (true);

-- RLS Policies for showtimes (public read)
CREATE POLICY "showtimes_read_all" ON showtimes FOR SELECT TO public USING (true);

-- RLS Policies for seats (public read)
CREATE POLICY "seats_read_all" ON seats FOR SELECT TO public USING (true);
CREATE POLICY "seats_update_authenticated" ON seats FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for bookings
CREATE POLICY "bookings_read_public" ON bookings FOR SELECT TO public USING (true);
CREATE POLICY "bookings_insert_authenticated" ON bookings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "bookings_update_authenticated" ON bookings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for user_profiles
CREATE POLICY "profiles_read_all" ON user_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON user_profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "profiles_update_own" ON user_profiles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);