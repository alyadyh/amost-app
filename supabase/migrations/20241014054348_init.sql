-- Profiles Table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  deleted boolean DEFAULT false
);

-- Medicines Table
CREATE TABLE medicines (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  med_name text NOT NULL,
  med_form text NOT NULL,
  dosage text NOT NULL,
  dose_quantity integer NOT NULL,
  frequency text NOT NULL,
  frequency_times_per_day integer NOT NULL,
  frequency_interval_days integer NOT NULL,
  reminder_times text[] NOT NULL,
  duration integer NOT NULL,
  stock_quantity integer NOT NULL,
  med_photos text,
  instructions text,
  prescribing_doctor text,
  dispensing_pharmacy text,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  deleted boolean DEFAULT false
);

-- Med Logs Table
CREATE TABLE med_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  medicine_id uuid REFERENCES medicines ON DELETE SET NULL,
  log_date date NOT NULL,
  log_time time without time zone,
  reminder_time time without time zone NOT NULL,
  taken boolean,
  med_name text,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  deleted boolean DEFAULT false,
  CONSTRAINT unique_med_log UNIQUE (user_id, medicine_id, log_date, reminder_time)
);


ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE med_logs ENABLE ROW LEVEL SECURITY;


-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Medicines Policies
CREATE POLICY "Individuals can view their own medicines." ON medicines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Individuals can insert their own medicines." ON medicines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Individuals can update their own medicines." ON medicines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Individuals can delete their own medicines." ON medicines FOR DELETE USING (auth.uid() = user_id);

-- Med Logs Policies
CREATE POLICY "Individuals can view their own medicines logs." ON med_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Individuals can insert their own medicines logs." ON med_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Individuals can update their own medicines logs." ON med_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Individuals can delete their own medicine logs." ON med_logs FOR DELETE USING (auth.uid() = user_id);


-- Handle Times Function
CREATE OR REPLACE FUNCTION handle_times() RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    NEW.created_at := now();
    NEW.updated_at := now();
  ELSIF (TG_OP = 'UPDATE') THEN
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Triggers
CREATE TRIGGER handle_profiles_times BEFORE INSERT OR UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_times();
CREATE TRIGGER handle_medicines_times BEFORE INSERT OR UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION handle_times();
CREATE TRIGGER handle_med_logs_times BEFORE INSERT OR UPDATE ON med_logs FOR EACH ROW EXECUTE FUNCTION handle_times();


ALTER PUBLICATION supabase_realtime ADD TABLE profiles, medicines, med_logs;
