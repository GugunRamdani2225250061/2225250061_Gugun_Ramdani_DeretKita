"""
Analisis hasil uji coba soal (Lembar C di docs/INSTRUMEN.md).

Jalankan (boleh lebih dari satu file CSV, mis. dari beberapa HP):
    python analisis/analisis_uji_coba.py analisis/data/contoh_uji_coba.csv
    python analisis/analisis_uji_coba.py hp1.csv hp2.csv

Format CSV (satu baris = satu siswa mengerjakan satu soal). File dari tombol
"Unduh CSV uji coba" di Dasbor aplikasi sudah memakai format ini:
    kode_siswa,soal_id,benar,waktu_detik,butuh_bantuan,persepsi,paas
    - benar         : 1 = benar (percobaan pertama), 0 = salah
    - butuh_bantuan : 1 = memakai petunjuk/pembahasan, 0 = tidak
    - persepsi      : 1 terlalu mudah, 2 sesuai, 3 sulit, 4 terlalu sulit (boleh kosong)
    - paas          : rating usaha mental 1-9
Kolom lain (mis. modul_id, waktu) diabaikan.

Catatan: jika siswa uji coba hanya 1-2 orang, indeks kesukaran (p) belum
bermakna secara statistik. Putuskan revisi terutama dari persepsi, rating Paas,
dan catatan think-aloud. Statistik ini akan lebih berarti di uji kelompok kecil.
"""
import csv
import statistics as st
import sys
from collections import defaultdict


def _angka(v):
    if v is None or isinstance(v, bool):
        return None if v is None else float(v)
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip().lower()
    if s in ("", "-", "none", "null"):
        return None
    if s in ("true", "false"):
        return 1.0 if s == "true" else 0.0
    try:
        return float(s.replace(",", "."))
    except ValueError:
        return None


def _rata(nilai):
    v = [x for x in nilai if x is not None]
    return st.mean(v) if v else None


def kategori_p(p):
    if p is None:
        return "-"
    if p > 0.70:
        return "mudah"
    if p >= 0.30:
        return "sedang"
    return "sukar"


def rekomendasi(p, persepsi, paas, bantuan):
    p = 0 if p is None else p
    persepsi = 2 if persepsi is None else persepsi
    paas = 5 if paas is None else paas
    bantuan = 0 if bantuan is None else bantuan
    if persepsi >= 3.5 or paas >= 8:
        return "SEDERHANAKAN (kalimat/angka) atau pecah jadi sub-soal"
    if persepsi >= 2.5 or bantuan >= 0.5:
        return "Tambah hint / worked example"
    if persepsi < 1.5 and p == 1 and paas <= 3:
        return "Terlalu mudah: naikkan level/tantangan"
    return "Pertahankan"


def hitung(records):
    """records: list of dict -> {'soal': [...], 'ringkasan': {...}}"""
    per = defaultdict(list)
    for r in records:
        sid = str(r.get("soal_id", "")).strip()
        if sid:
            per[sid].append(r)

    soal = []
    for sid in sorted(per):
        rows = per[sid]
        d = {
            "soal_id": sid,
            "n": len(rows),
            "p": _rata(_angka(r.get("benar")) for r in rows),
            "waktu": _rata(_angka(r.get("waktu_detik")) for r in rows),
            "persepsi": _rata(_angka(r.get("persepsi")) for r in rows),
            "paas": _rata(_angka(r.get("paas")) for r in rows),
            "bantuan": _rata(_angka(r.get("butuh_bantuan")) for r in rows),
            "ai": _rata(_angka(r.get("ai_dipakai")) for r in rows),  # pemakaian Kak Deret
        }
        d["kategori"] = kategori_p(d["p"])
        d["rekomendasi"] = rekomendasi(d["p"], d["persepsi"], d["paas"], d["bantuan"])
        soal.append(d)

    ringkasan = {
        "jumlah_siswa": len({str(r.get("kode_siswa", "")) for r in records}),
        "jumlah_soal": len(soal),
        "rata_paas": _rata(s["paas"] for s in soal),
        "korelasi_p_paas": None,
    }
    pasangan = [(s["p"], s["paas"]) for s in soal if s["p"] is not None and s["paas"] is not None]
    if len(pasangan) >= 3:
        try:
            ringkasan["korelasi_p_paas"] = st.correlation([a for a, _ in pasangan], [b for _, b in pasangan])
        except st.StatisticsError:
            pass  # semua nilai sama
    return {"soal": soal, "ringkasan": ringkasan}


def baca_csv(paths):
    rows = []
    for path in paths:
        with open(path, newline="", encoding="utf-8-sig") as f:
            rows.extend(csv.DictReader(f))
    return rows


def _f(v, d=2):
    return "-" if v is None else f"{v:.{d}f}"


def tampilkan(hasil):
    r = hasil["ringkasan"]
    print(f"Jumlah siswa: {r['jumlah_siswa']} | jumlah soal: {r['jumlah_soal']}\n")
    header = f"{'Soal':<5} {'n':>2} {'p':>5} {'Kategori':<8} {'Waktu(s)':>8} {'Persepsi':>8} {'Paas':>5} {'Bantuan':>7}  Rekomendasi"
    print(header)
    print("-" * (len(header) + 30))
    for s in hasil["soal"]:
        print(f"{s['soal_id']:<5} {s['n']:>2} {_f(s['p']):>5} {s['kategori']:<8} {_f(s['waktu'], 0):>8} "
              f"{_f(s['persepsi']):>8} {_f(s['paas'], 1):>5} {_f(s['bantuan']):>7}  {s['rekomendasi']}")
    print()
    print(f"Rata-rata rating Paas seluruh soal: {_f(r['rata_paas'])} (target <= 5)")
    if r["korelasi_p_paas"] is not None:
        print(f"Korelasi p (kemudahan) vs Paas: {r['korelasi_p_paas']:.2f} (negatif berarti soal sulit = beban tinggi)")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    print("File:", ", ".join(sys.argv[1:]))
    tampilkan(hitung(baca_csv(sys.argv[1:])))
