-- Allow anonymous "curator" seed pins (user_id null).
-- Seed script inserts iconic places with no owner; the UI
-- already handles pins whose user_id is null as read-only.
alter table pins
  alter column user_id drop not null;
