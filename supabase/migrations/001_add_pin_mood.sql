-- Add mood column to pins for Vibe filter feature
alter table pins
  add column if not exists mood text
  check (mood in ('chill', 'energy', 'melancholy', 'romantic', 'nostalgic'));

create index if not exists idx_pins_mood on pins(mood);
