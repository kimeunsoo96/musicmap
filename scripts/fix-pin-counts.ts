/**
 * One-off repair: recompute places.pin_count from actual pin rows.
 * Run with: `npx tsx scripts/fix-pin-counts.ts`
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const env = readFileSync(envPath, 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function main() {
  const { data: places, error } = await sb.from('places').select('id, name, pin_count');
  if (error || !places) throw new Error(error?.message);

  let fixed = 0;
  for (const p of places) {
    const { count } = await sb
      .from('pins').select('*', { count: 'exact', head: true }).eq('place_id', p.id);
    const actual = count ?? 0;
    if (actual !== p.pin_count) {
      await sb.from('places').update({ pin_count: actual }).eq('id', p.id);
      console.log(`  ✓ ${p.name}: ${p.pin_count} → ${actual}`);
      fixed++;
    }
  }
  console.log(`\nDone. ${fixed} places updated out of ${places.length}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
