-- Menambah kolom jumlah pemakaian Kak Deret (AI) per soal.
-- Jalankan di Supabase > SQL Editor jika 0001_init.sql sudah pernah dijalankan.
alter table public.jawaban add column if not exists ai_dipakai int default 0;
