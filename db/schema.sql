CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS ticket_categories CASCADE;
DROP TABLE IF EXISTS events CASCADE;

CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name      TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'USER'
                 CHECK (role IN ('USER', 'ADMIN')),   -- ← you write this
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE events (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL,
  venue_name    TEXT NOT NULL,
  city          TEXT NOT NULL,
  starts_at     TIMESTAMPTZ NOT NULL,
  timezone      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'DRAFT'
                CHECK (status IN ('DRAFT', 'PUBLISHED', 'CANCELLED')),
  poster_url    TEXT,
  source        TEXT NOT NULL DEFAULT 'admin'
                CHECK (source IN ('admin', 'ticketmaster')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ticket_categories (
  id                  SERIAL PRIMARY KEY,
  event_id            INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  price_paise         INTEGER NOT NULL CHECK (price_paise > 0),
  total_quantity      INTEGER NOT NULL CHECK (total_quantity > 0),
  available_quantity  INTEGER NOT NULL CHECK (available_quantity >= 0),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  CHECK (available_quantity <= total_quantity),
  UNIQUE (event_id, name)
);