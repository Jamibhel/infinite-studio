# Fix #1: Database Schema Verification

Run these queries in Supabase SQL Editor to verify your database structure:

## Query 1: Check Bookings Table
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;
```

## Query 2: Check Spaces Table
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'spaces' 
ORDER BY ordinal_position;
```

## Query 3: Check Site Config Table
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'site_config' 
ORDER BY ordinal_position;
```

## Expected Schema for Bookings Table

```
id                  | uuid                    | NO       | gen_random_uuid()
name                | text                    | NO       |
email               | text                    | NO       |
phone               | text                    | NO       |
spaces              | text[] OR jsonb         | NO       |
date                | date                    | NO       |
time                | text                    | NO       |
status              | text                    | NO       | 'pending'
group_size          | integer                 | NO       | 1
addons              | text[] OR jsonb         | NO       |
amount              | integer                 | YES      |
notes               | text                    | YES      |
created_at          | timestamp with tz      | NO       | now()
```

## Expected Schema for Spaces Table

```
id                  | text                    | NO       | PRIMARY KEY
name                | text                    | NO       |
description         | text                    | YES      |
mood_tag            | text                    | YES      |
price               | integer                 | NO       |
capacity            | integer                 | YES      |
amenities           | text[] OR jsonb         | YES      |
images              | text[] OR jsonb         | YES      |
is_active           | boolean                 | NO       | true
sort_order          | integer                 | YES      |
created_at          | timestamp with tz      | NO       | now()
```

## If Tables Don't Exist, Create Them

### Create Bookings Table
```sql
CREATE TABLE public.bookings (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  spaces TEXT[] NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  group_size INTEGER NOT NULL DEFAULT 1,
  addons TEXT[] NOT NULL DEFAULT '{}',
  amount INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to read own bookings" ON public.bookings
  FOR SELECT USING (true);
```

### Create Spaces Table
```sql
CREATE TABLE public.spaces (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  mood_tag TEXT,
  price INTEGER NOT NULL,
  capacity INTEGER,
  amenities TEXT[],
  images TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to read active spaces" ON public.spaces
  FOR SELECT USING (is_active = true);
```

### Create Site Config Table
```sql
CREATE TABLE public.site_config (
  key TEXT NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to read config" ON public.site_config
  FOR SELECT USING (true);
```

---

**Next Steps:**
1. Run the check queries in Supabase
2. If tables exist, verify column types match
3. If tables missing, run the CREATE TABLE queries
4. Then proceed to Fix #5 (Complete Spaces Save)
