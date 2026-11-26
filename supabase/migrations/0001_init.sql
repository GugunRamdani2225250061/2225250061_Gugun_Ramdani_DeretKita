-- DeretKita: skema awal Supabase.
-- Cara pakai: Supabase > SQL Editor > New query > tempel seluruh isi file ini > Run.
-- Lalu aktifkan: Authentication > Sign In / Providers > "Allow anonymous sign-ins".
-- Materi & soal disimpan di kode aplikasi (apps/web/src/content), bukan di database.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  peran text not null default 'siswa' check (peran in ('siswa', 'guru', 'peneliti')),
  nama_panggilan text,
  kode_siswa text unique,          -- anonim, mis. S-7KQ2
  kode_kelas text,
  created_at timestamptz default now()
);

create table if not exists public.jawaban (
  id bigint generated always as identity primary key,
  siswa_id uuid not null default auth.uid() references auth.users on delete cascade,
  kode_siswa text,
  kode_kelas text,
  soal_id text not null,           -- sama dengan ID di docs/BANK_SOAL_DRAFT.md
  modul_id text,
  benar boolean,                   -- semua langkah benar pada percobaan pertama
  skor_bagian numeric,             -- proporsi langkah yang benar pada percobaan pertama
  waktu_detik int,
  hint_dipakai int default 0,
  ai_dipakai int default 0,        -- berapa kali bertanya ke Kak Deret (AI)
  butuh_bantuan boolean,
  persepsi int check (persepsi between 1 and 4),
  paas int check (paas between 1 and 9),
  detail jsonb,
  created_at timestamptz default now()
);

create table if not exists public.angket (
  id bigint generated always as identity primary key,
  siswa_id uuid not null default auth.uid() references auth.users on delete cascade,
  kode_siswa text,
  jenis text check (jenis in ('leppink', 'sus')),
  respon jsonb not null,           -- 10 angka sesuai urutan butir
  skor jsonb,
  created_at timestamptz default now()
);

create table if not exists public.refleksi (
  id bigint generated always as identity primary key,
  siswa_id uuid not null default auth.uid() references auth.users on delete cascade,
  kode_siswa text,
  modul_id text,
  teks text,
  created_at timestamptz default now()
);

-- ===== Keamanan: setiap siswa hanya bisa menulis & membaca datanya sendiri =====
alter table public.profiles enable row level security;
alter table public.jawaban  enable row level security;
alter table public.angket   enable row level security;
alter table public.refleksi enable row level security;

create policy "profil milik sendiri" on public.profiles
  for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "jawaban: tambah sendiri" on public.jawaban for insert to authenticated with check (auth.uid() = siswa_id);
create policy "jawaban: baca sendiri"   on public.jawaban for select to authenticated using (auth.uid() = siswa_id);
create policy "angket: tambah sendiri"  on public.angket  for insert to authenticated with check (auth.uid() = siswa_id);
create policy "angket: baca sendiri"    on public.angket  for select to authenticated using (auth.uid() = siswa_id);
create policy "refleksi: tambah sendiri" on public.refleksi for insert to authenticated with check (auth.uid() = siswa_id);
create policy "refleksi: baca sendiri"   on public.refleksi for select to authenticated using (auth.uid() = siswa_id);

-- Guru/peneliti membaca SEMUA data lewat API Python (service role key, hanya di server)
-- atau langsung di Supabase > Table Editor (bisa diekspor ke CSV).
