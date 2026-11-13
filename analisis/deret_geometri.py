"""
Rumus barisan & deret geometri + pengecekan kunci jawaban bank soal.

Jalankan:  python analisis/deret_geometri.py
Hanya memakai pustaka standar Python (tidak perlu install apa pun).
Perhitungan memakai Fraction agar hasilnya tepat (tanpa pembulatan desimal).
"""
from fractions import Fraction as F


def suku_ke_n(a, r, n):
    """U_n = a * r^(n-1)"""
    if n < 1:
        raise ValueError("n minimal 1")
    return F(a) * F(r) ** (n - 1)


def jumlah_n(a, r, n):
    """S_n = jumlah n suku pertama barisan geometri."""
    a, r = F(a), F(r)
    if r == 1:
        return a * n
    return a * (r ** n - 1) / (r - 1)


def barisan(a, r, k):
    """k suku pertama, mis. barisan(3, 2, 4) -> [3, 6, 12, 24]"""
    return [suku_ke_n(a, r, i) for i in range(1, k + 1)]


def rasio(daftar):
    """Rasio jika daftar merupakan barisan geometri, selain itu None."""
    if len(daftar) < 2 or any(x == 0 for x in daftar[:-1]):
        return None
    r = F(daftar[1]) / F(daftar[0])
    for i in range(1, len(daftar) - 1):
        if F(daftar[i + 1]) / F(daftar[i]) != r:
            return None
    return r


# ---------- Kunci jawaban bank soal (docs/BANK_SOAL_DRAFT.md) ----------
KUNCI = [
    ("G01 r", rasio([3, 6, 12, 24]), 2),
    ("G01 U8", suku_ke_n(3, 2, 8), 384),
    ("G02 A bukan geometri", rasio([2, 4, 6, 8]), None),
    ("G02 B geometri r=1/3", rasio([81, 27, 9, 3]), F(1, 3)),
    ("G02 C bukan geometri", rasio([1, 4, 9, 16]), None),
    ("G02 D bukan geometri", rasio([5, 10, 16, 23]), None),
    ("G03 lipat 5x", suku_ke_n(2, 2, 5), 32),
    ("G04 bakteri 2 jam", suku_ke_n(5, 2, 7), 320),
    ("G05 pantulan ke-4", suku_ke_n(80, F(1, 2), 4), 10),
    ("G06 obat 12 jam", suku_ke_n(200, F(1, 2), 4), 25),
    ("G07 hari ke-4", suku_ke_n(3, 3, 4), 81),
    ("G08 total 4 hari", jumlah_n(3, 3, 4), 120),
    ("G09a hari ke-7", suku_ke_n(1000, 2, 7), 64000),
    ("G09b total 7 hari", jumlah_n(1000, 2, 7), 127000),
    ("G09c hari ke-30", suku_ke_n(1000, 2, 30), 536870912000),
    ("G10 motor 2 tahun", suku_ke_n(20_000_000, F(4, 5), 3), 12_800_000),
    ("G11 U6 benar", suku_ke_n(5, 2, 6), 160),
    ("G12 setengah penuh", suku_ke_n(1, 2, 9) / suku_ke_n(1, 2, 10), F(1, 2)),
    ("G13 tawaran A", 10 * 10_000, 100_000),
    ("G13 tawaran B", jumlah_n(100, 2, 10), 102_300),
    ("G13 B hari ke-10", suku_ke_n(100, 2, 10), 51_200),
    ("G13 B 9 hari", jumlah_n(100, 2, 9), 51_100),
]


def cek_kunci():
    salah = 0
    for nama, hasil, harapan in KUNCI:
        ok = hasil == harapan
        salah += not ok
        print(f"[{'OK ' if ok else 'SALAH'}] {nama:<24} hasil={hasil}  kunci={harapan}")
    print()
    print("Semua kunci jawaban BENAR." if salah == 0 else f"Ada {salah} kunci yang SALAH!")
    return salah


if __name__ == "__main__":
    print("Contoh: barisan(3, 2, 6) =", [int(x) for x in barisan(3, 2, 6)])
    print()
    raise SystemExit(cek_kunci())
