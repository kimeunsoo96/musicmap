-- MusicMap Database Schema
-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists places (
  id               uuid primary key default gen_random_uuid(),
  google_place_id  text unique not null,
  name             text not null,
  lat              float8,
  lng              float8,
  city             text,
  country          text,
  cover_image      text,
  pin_count        int not null default 0,
  created_at       timestamptz not null default now()
);

create table if not exists tracks (
  id                uuid primary key default gen_random_uuid(),
  spotify_track_id  text unique not null,
  title             text not null,
  artist            text not null,
  album             text,
  album_art_url     text,
  preview_url       text,
  duration_ms       int,
  created_at        timestamptz not null default now()
);

create table if not exists pins (
  id           uuid primary key default gen_random_uuid(),
  place_id     uuid not null references places(id) on delete cascade,
  track_id     uuid not null references tracks(id),
  user_id      uuid not null references auth.users(id),
  caption      text check (char_length(caption) <= 140),
  likes_count  int not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists pin_likes (
  id          uuid primary key default gen_random_uuid(),
  pin_id      uuid not null references pins(id) on delete cascade,
  user_id     uuid not null references auth.users(id),
  created_at  timestamptz not null default now(),
  unique (pin_id, user_id)
);

create table if not exists saved_places (
  id          uuid primary key default gen_random_uuid(),
  place_id    uuid not null references places(id) on delete cascade,
  user_id     uuid not null references auth.users(id),
  created_at  timestamptz not null default now(),
  unique (place_id, user_id)
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_places_google_place_id on places(google_place_id);
create index if not exists idx_tracks_spotify_track_id on tracks(spotify_track_id);
create index if not exists idx_pins_place_id on pins(place_id);
create index if not exists idx_pins_user_id on pins(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table places       enable row level security;
alter table tracks       enable row level security;
alter table pins         enable row level security;
alter table pin_likes    enable row level security;
alter table saved_places enable row level security;

-- places: public read
create policy "places_public_read"
  on places for select
  using (true);

-- tracks: public read
create policy "tracks_public_read"
  on tracks for select
  using (true);

-- pins: public read
create policy "pins_public_read"
  on pins for select
  using (true);

-- pins: authenticated insert
create policy "pins_authenticated_insert"
  on pins for insert
  to authenticated
  with check (auth.uid() = user_id);

-- pins: authenticated delete (own pins only)
create policy "pins_authenticated_delete"
  on pins for delete
  to authenticated
  using (auth.uid() = user_id);

-- pin_likes: public read
create policy "pin_likes_public_read"
  on pin_likes for select
  using (true);

-- pin_likes: authenticated insert
create policy "pin_likes_authenticated_insert"
  on pin_likes for insert
  to authenticated
  with check (auth.uid() = user_id);

-- pin_likes: authenticated delete (own likes only)
create policy "pin_likes_authenticated_delete"
  on pin_likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- saved_places: authenticated read (own saves only)
create policy "saved_places_authenticated_read"
  on saved_places for select
  to authenticated
  using (auth.uid() = user_id);

-- saved_places: authenticated insert
create policy "saved_places_authenticated_insert"
  on saved_places for insert
  to authenticated
  with check (auth.uid() = user_id);

-- saved_places: authenticated delete (own saves only)
create policy "saved_places_authenticated_delete"
  on saved_places for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: auto-update places.pin_count
-- ============================================================

create or replace function update_place_pin_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if (TG_OP = 'INSERT') then
    update places
    set pin_count = pin_count + 1
    where id = NEW.place_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update places
    set pin_count = greatest(pin_count - 1, 0)
    where id = OLD.place_id;
    return OLD;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_pins_update_place_pin_count on pins;
create trigger trg_pins_update_place_pin_count
  after insert or delete on pins
  for each row execute function update_place_pin_count();

-- ============================================================
-- TRIGGER: auto-update pins.likes_count
-- ============================================================

create or replace function update_pin_likes_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if (TG_OP = 'INSERT') then
    update pins
    set likes_count = likes_count + 1
    where id = NEW.pin_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update pins
    set likes_count = greatest(likes_count - 1, 0)
    where id = OLD.pin_id;
    return OLD;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_pin_likes_update_likes_count on pin_likes;
create trigger trg_pin_likes_update_likes_count
  after insert or delete on pin_likes
  for each row execute function update_pin_likes_count();
